"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function AuthError() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [errorDescription, setErrorDescription] = useState<string>("")

  useEffect(() => {
    const errorParam = searchParams?.get("error")
    setError(errorParam)

    // Set a more user-friendly error description based on the error code
    if (errorParam === "Configuration") {
      setErrorDescription("There is a problem with the server configuration. Please contact support.")
    } else if (errorParam === "AccessDenied") {
      setErrorDescription("You do not have permission to sign in.")
    } else if (errorParam === "Verification") {
      setErrorDescription("The verification link may have been used or has expired.")
    } else if (errorParam === "OAuthSignin" || errorParam === "OAuthCallback" || errorParam === "OAuthCreateAccount") {
      setErrorDescription("There was a problem with the OAuth authentication process. Please try again.")
    } else if (errorParam === "EmailCreateAccount") {
      setErrorDescription("There was a problem creating your account with this email. Please try another method.")
    } else if (errorParam === "Callback") {
      setErrorDescription("There was a problem with the authentication callback. Please try again.")
    } else if (errorParam === "OAuthAccountNotLinked") {
      setErrorDescription(
        "This email is already associated with another account. Please sign in using the original provider.",
      )
    } else if (errorParam === "EmailSignin") {
      setErrorDescription("There was a problem sending the email. Please try again.")
    } else if (errorParam === "CredentialsSignin") {
      setErrorDescription("The sign in details you provided were invalid. Please try again.")
    } else if (errorParam === "SessionRequired") {
      setErrorDescription("You need to be signed in to access this page.")
    } else if (errorParam === "Default") {
      setErrorDescription("An unknown error occurred. Please try again.")
    } else {
      setErrorDescription("An error occurred during authentication. Please try again.")
    }
  }, [searchParams])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <h1 className="mb-4 text-2xl font-bold text-red-600">Authentication Error</h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">Error Code: {error}</p>
          </div>
        )}

        <p className="mb-6 text-gray-700 dark:text-gray-300">{errorDescription}</p>

        <div className="flex flex-col gap-4">
          <Link
            href="/auth/signin"
            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </Link>

          <Link
            href="/"
            className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
