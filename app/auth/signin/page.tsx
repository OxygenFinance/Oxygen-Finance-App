"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function SignIn() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState({
    google: false,
    twitter: false,
  })

  const handleSignIn = async (provider: "google" | "twitter") => {
    try {
      setIsLoading({ ...isLoading, [provider]: true })
      await signIn(provider, { callbackUrl: "/profile" })
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error)
      setIsLoading({ ...isLoading, [provider]: false })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

        <div className="space-y-4">
          <button
            onClick={() => handleSignIn("google")}
            disabled={isLoading.google}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {isLoading.google ? "Signing in..." : "Sign in with Google"}
          </button>

          <button
            onClick={() => handleSignIn("twitter")}
            disabled={isLoading.twitter}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {isLoading.twitter ? "Signing in..." : "Sign in with Twitter"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button onClick={() => router.push("/")} className="text-sm text-gray-600 hover:text-gray-900">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
