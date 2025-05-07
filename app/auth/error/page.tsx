"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function AuthError() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get("error")
    setError(errorParam)
  }, [searchParams])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>

        {error && (
          <div className="p-4 mb-4 bg-red-100 border border-red-200 rounded-md">
            <p className="text-red-700">Error: {error}</p>
          </div>
        )}

        <p className="mb-4">There was a problem with authentication. This could be due to:</p>

        <ul className="list-disc pl-5 mb-4 space-y-2">
          <li>Temporary service disruption</li>
          <li>Invalid credentials</li>
          <li>Session expiration</li>
          <li>Server configuration issues</li>
        </ul>

        <div className="flex flex-col space-y-2">
          <Link
            href="/auth/signin"
            className="w-full py-2 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </Link>
          <Link href="/" className="w-full py-2 text-center bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}
