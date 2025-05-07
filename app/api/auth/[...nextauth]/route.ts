import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import TwitterProvider from "next-auth/providers/twitter"
import { sql } from "@/lib/db"

// Custom adapter using direct SQL queries instead of Prisma
const customAdapter = {
  async createUser(user) {
    try {
      const result = await sql`
       INSERT INTO users (id, name, email, image)
       VALUES (${crypto.randomUUID()}, ${user.name}, ${user.email || null}, ${user.image || null})
       RETURNING id, name, email, image
     `
      return result[0]
    } catch (error) {
      console.error("Error creating user:", error)
      throw new Error(`Failed to create user: ${error.message}`)
    }
  },

  async getUser(id) {
    try {
      const result = await sql`
       SELECT * FROM users WHERE id = ${id}
     `
      return result[0] || null
    } catch (error) {
      console.error("Error getting user:", error)
      throw new Error(`Failed to get user: ${error.message}`)
    }
  },

  async getUserByEmail(email) {
    if (!email) return null

    try {
      const result = await sql`
       SELECT * FROM users WHERE email = ${email}
     `
      return result[0] || null
    } catch (error) {
      console.error("Error getting user by email:", error)
      throw new Error(`Failed to get user by email: ${error.message}`)
    }
  },

  async getUserByAccount({ provider, providerAccountId }) {
    try {
      const result = await sql`
       SELECT u.* FROM users u
       JOIN accounts a ON u.id = a.user_id
       WHERE a.provider = ${provider} AND a.provider_account_id = ${providerAccountId}
     `
      return result[0] || null
    } catch (error) {
      console.error("Error getting user by account:", error)
      throw new Error(`Failed to get user by account: ${error.message}`)
    }
  },

  async updateUser(user) {
    try {
      const result = await sql`
       UPDATE users
       SET name = ${user.name}, email = ${user.email || null}, image = ${user.image || null}
       WHERE id = ${user.id}
       RETURNING *
     `
      return result[0]
    } catch (error) {
      console.error("Error updating user:", error)
      throw new Error(`Failed to update user: ${error.message}`)
    }
  },

  async linkAccount(account) {
    try {
      await sql`
       INSERT INTO accounts (
         user_id, provider, provider_account_id, type, 
         access_token, token_type, expires_at, refresh_token, id_token
       )
       VALUES (
         ${account.userId}, ${account.provider}, ${account.providerAccountId}, ${account.type},
         ${account.access_token || null}, ${account.token_type || null}, ${account.expires_at || null}, 
         ${account.refresh_token || null}, ${account.id_token || null}
       )
     `
      return account
    } catch (error) {
      console.error("Error linking account:", error)
      throw new Error(`Failed to link account: ${error.message}`)
    }
  },

  async createSession(session) {
    try {
      await sql`
       INSERT INTO sessions (id, user_id, expires, session_token)
       VALUES (${crypto.randomUUID()}, ${session.userId}, ${new Date(session.expires)}, ${session.sessionToken})
     `
      return session
    } catch (error) {
      console.error("Error creating session:", error)
      throw new Error(`Failed to create session: ${error.message}`)
    }
  },

  async getSessionAndUser(sessionToken) {
    try {
      const result = await sql`
       SELECT s.*, u.* FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.session_token = ${sessionToken}
     `
      if (result.length === 0) return null

      const { id, user_id, expires, session_token, ...userData } = result[0]
      return {
        session: { id, userId: user_id, expires, sessionToken: session_token },
        user: userData,
      }
    } catch (error) {
      console.error("Error getting session and user:", error)
      throw new Error(`Failed to get session and user: ${error.message}`)
    }
  },

  async updateSession(session) {
    try {
      const result = await sql`
       UPDATE sessions
       SET expires = ${new Date(session.expires)}
       WHERE session_token = ${session.sessionToken}
       RETURNING *
     `
      return result[0]
    } catch (error) {
      console.error("Error updating session:", error)
      throw new Error(`Failed to update session: ${error.message}`)
    }
  },

  async deleteSession(sessionToken) {
    try {
      await sql`
       DELETE FROM sessions
       WHERE session_token = ${sessionToken}
     `
    } catch (error) {
      console.error("Error deleting session:", error)
      throw new Error(`Failed to delete session: ${error.message}`)
    }
  },
}

export const authOptions = {
  adapter: customAdapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID || "",
      clientSecret: process.env.TWITTER_CLIENT_SECRET || "",
      version: "2.0",
      authorization: {
        url: "https://twitter.com/i/oauth2/authorize",
        params: {
          scope: "tweet.read users.read follows.read offline.access",
        },
      },
      profile(profile) {
        return {
          id: profile.data.id,
          name: profile.data.name,
          email: null, // Twitter doesn't provide email by default
          image: profile.data.profile_image_url,
          username: profile.data.username,
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Add user ID from token to the session
      if (session?.user) {
        session.user.id = token.sub
        // Add Twitter username if available
        session.user.username = token.username || null
        session.user.walletAddress = token.walletAddress || null
      }
      return session
    },
    async jwt({ token, user, account, profile }) {
      // Persist user data in the token
      if (user) {
        token.id = user.id
      }

      // Add Twitter-specific data
      if (account?.provider === "twitter" && profile) {
        token.username = profile.data?.username
        token.twitterId = profile.data?.id
      }

      return token
    },
    async signIn({ user, account, profile }) {
      // If it's a Twitter login, store the Twitter username
      if (account?.provider === "twitter" && profile) {
        try {
          // Check if user exists
          const existingUser = await sql`
            SELECT * FROM users WHERE twitter = ${profile.data?.username}
          `

          if (existingUser.length > 0) {
            // Update existing user with Twitter info
            await sql`
              UPDATE users
              SET twitter = ${profile.data?.username},
                  twitter_id = ${profile.data?.id},
                  avatar_url = COALESCE(${profile.data?.profile_image_url}, avatar_url)
              WHERE id = ${existingUser[0].id}
            `
          } else {
            // Create new user with Twitter info if user doesn't exist
            if (!user.id) {
              await sql`
                INSERT INTO users (id, name, twitter, twitter_id, avatar_url)
                VALUES (
                  ${crypto.randomUUID()}, 
                  ${profile.data?.name}, 
                  ${profile.data?.username},
                  ${profile.data?.id},
                  ${profile.data?.profile_image_url}
                )
              `
            } else {
              // Update existing user
              await sql`
                UPDATE users
                SET twitter = ${profile.data?.username},
                    twitter_id = ${profile.data?.id},
                    avatar_url = COALESCE(${profile.data?.profile_image_url}, avatar_url)
                WHERE id = ${user.id}
              `
            }
          }
        } catch (error) {
          console.error("Error updating Twitter information:", error)
          // Don't throw here, just log the error and continue
        }
      }
      return true
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.SESSION_SECRET,
  debug: process.env.NODE_ENV === "development",
}

// Add error handling to the NextAuth handler
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
