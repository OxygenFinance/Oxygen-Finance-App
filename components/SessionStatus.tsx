"use client"

import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"

export function SessionStatus() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="text-sm text-gray-500">Loading session...</div>
  }

  if (status === "authenticated") {
    return (
      <div className="rounded-md bg-green-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">Authenticated</h3>
            <div className="mt-2 text-sm text-green-700">
              <p>Signed in as {session.user?.name || session.user?.email}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => signOut()}
                className="rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md bg-yellow-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">Not authenticated</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>You are not signed in.</p>
          </div>
          <div className="mt-4">
            <a
              href="/auth"
              className="rounded-md bg-yellow-50 px-2 py-1.5 text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2"
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
