import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import TwitterProvider from "next-auth/providers/twitter"
import { sql } from "@/lib/db"

// Custom adapter using direct SQL queries instead of Prisma
const customAdapter = {
  async createUser(user) {
    try {
      const result = await sql`
        INSERT INTO users (name, email, image)
        VALUES (${user.name || null}, ${user.email || null}, ${user.image || null})
        RETURNING id, name, email, image
      `
      return result[0]
    } catch (error) {
      console.error("Error creating user:", error)
      throw error // Rethrow to let NextAuth handle it properly
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
      throw error
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
      throw error
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
      throw error
    }
  },

  async updateUser(user) {
    try {
      const result = await sql`
        UPDATE users
        SET name = ${user.name || null}, email = ${user.email || null}, image = ${user.image || null}
        WHERE id = ${user.id}
        RETURNING *
      `
      return result[0]
    } catch (error) {
      console.error("Error updating user:", error)
      throw error
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
      throw error
    }
  },

  async createSession(session) {
    try {
      await sql`
        INSERT INTO sessions (user_id, expires, session_token)
        VALUES (${session.userId}, ${new Date(session.expires)}, ${session.sessionToken})
      `
      return session
    } catch (error) {
      console.error("Error creating session:", error)
      throw error
    }
  },

  async getSessionAndUser(sessionToken) {
    try {
      const sessions = await sql`
        SELECT s.*, u.* FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.session_token = ${sessionToken}
      `

      if (!sessions || sessions.length === 0) return null

      const session = sessions[0]

      return {
        session: {
          userId: session.user_id,
          expires: session.expires,
          sessionToken: session.session_token,
        },
        user: {
          id: session.id,
          name: session.name,
          email: session.email,
          image: session.image,
        },
      }
    } catch (error) {
      console.error("Error getting session and user:", error)
      throw error
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
      throw error
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
      throw error
    }
  },
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID || "",
      clientSecret: process.env.TWITTER_CLIENT_SECRET || "",
      version: "2.0",
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub || ""
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.SESSION_SECRET,
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
