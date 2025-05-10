"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

export default function AuthPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError("")
      await signIn("google", { callbackUrl: "/" })
    } catch (err) {
      console.error("Google sign in error:", err)
      setError("Failed to sign in with Google")
    } finally {
      setLoading(false)
    }
  }

  const handleTwitterSignIn = async () => {
    try {
      setLoading(true)
      setError("")
      await signIn("twitter", { callbackUrl: "/" })
    } catch (err) {
      console.error("Twitter sign in error:", err)
      setError("Failed to sign in with Twitter")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="mt-2 text-gray-600">Choose your sign in method</p>
        </div>

        {error && <div className="rounded-md bg-red-50 p-4 text-red-700">{error}</div>}

        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex w-full items-center justify-center rounded-md bg-white px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

          <button
            onClick={handleTwitterSignIn}
            disabled={loading}
            className="flex w-full items-center justify-center rounded-md bg-[#1DA1F2] px-4 py-2 text-white shadow-sm hover:bg-[#0c8bd0] disabled:opacity-50"
          >
            <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
            Sign in with Twitter
          </button>
        </div>

        {loading && <div className="text-center text-gray-500">Loading...</div>}
      </div>
    </div>
  )
}
