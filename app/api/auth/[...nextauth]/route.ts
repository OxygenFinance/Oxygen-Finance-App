import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import TwitterProvider from "next-auth/providers/twitter"

// Create a minimal configuration without the custom adapter for now
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
  secret: process.env.NEXTAUTH_SECRET || process.env.SESSION_SECRET,
  debug: true, // Enable debug mode to see detailed logs
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
