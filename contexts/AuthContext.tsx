"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useSession, signIn, signOut } from "@/components/session-provider"

interface User {
  id: number
  name?: string
  email?: string
  walletAddress?: string
  avatar_url?: string
  created_at: Date
}

interface AuthContextType {
  user: User | null
  status: "loading" | "authenticated" | "unauthenticated" | "error"
  error: string | null
  signInWithGoogle: () => Promise<void>
  signInWithTwitter: () => Promise<void>
  connectWallet: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSession()
  const sessionStatus = session?.status || "loading"

  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated" | "error">("loading")
  const [error, setError] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Simplified user loading logic
    if (sessionStatus === "loading") {
      setStatus("loading")
    } else if (walletAddress) {
      setUser({
        id: 1,
        name: `User ${walletAddress.substring(0, 6)}`,
        walletAddress,
        created_at: new Date(),
      })
      setStatus("authenticated")
    } else {
      setUser(null)
      setStatus("unauthenticated")
    }
  }, [sessionStatus, walletAddress])

  const signInWithGoogle = async () => {
    try {
      setStatus("loading")
      await signIn()
      // Mock successful sign in
      setUser({
        id: 1,
        name: "Google User",
        email: "user@example.com",
        created_at: new Date(),
      })
      setStatus("authenticated")
    } catch (error) {
      console.error("Error signing in with Google:", error)
      setError("Failed to sign in with Google. Please try again.")
      setStatus("error")
    }
  }

  const signInWithTwitter = async () => {
    try {
      setStatus("loading")
      await signIn()
      // Mock successful sign in
      setUser({
        id: 2,
        name: "Twitter User",
        email: "twitter@example.com",
        created_at: new Date(),
      })
      setStatus("authenticated")
    } catch (error) {
      console.error("Error signing in with Twitter:", error)
      setError("Failed to sign in with Twitter. Please try again.")
      setStatus("error")
    }
  }

  const connectWallet = async () => {
    try {
      setStatus("loading")
      // Mock wallet connection
      const mockAddress = "0x1234567890abcdef1234567890abcdef12345678"
      setWalletAddress(mockAddress)
      setUser({
        id: 3,
        name: `User ${mockAddress.substring(0, 6)}`,
        walletAddress: mockAddress,
        created_at: new Date(),
      })
      setStatus("authenticated")
    } catch (error) {
      console.error("Error connecting wallet:", error)
      setError("Failed to connect wallet. Please try again.")
      setStatus("error")
    }
  }

  const logout = async () => {
    try {
      await signOut({ redirect: false })
      setUser(null)
      setWalletAddress(null)
      setStatus("unauthenticated")
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
      setError("Failed to log out. Please try again.")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        error,
        signInWithGoogle,
        signInWithTwitter,
        connectWallet,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
