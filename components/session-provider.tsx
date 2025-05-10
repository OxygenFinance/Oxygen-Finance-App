"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Session {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
}

interface SessionContextProps {
  data: Session | null
  status: "loading" | "authenticated" | "unauthenticated"
}

const SessionContext = createContext<SessionContextProps>({
  data: null,
  status: "loading",
})

export function useSession() {
  return useContext(SessionContext)
}

export function signIn() {
  // Mock implementation
  return Promise.resolve()
}

export function signOut(options?: { redirect: boolean }) {
  // Mock implementation
  return Promise.resolve()
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")

  useEffect(() => {
    // Mock loading session
    const timer = setTimeout(() => {
      setStatus("unauthenticated")
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return <SessionContext.Provider value={{ data: session, status }}>{children}</SessionContext.Provider>
}
