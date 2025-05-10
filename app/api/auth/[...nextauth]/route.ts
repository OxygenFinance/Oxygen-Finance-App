import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import TwitterProvider from "next-auth/providers/twitter"

const handler = NextAuth({
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
  secret: process.env.NEXTAUTH_SECRET || "default-secret-for-development",
  debug: process.env.NODE_ENV !== "production",
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
})

export { handler as GET, handler as POST }
