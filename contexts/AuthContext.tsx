"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useSession, signIn, signOut } from "next-auth/react"
import { useInbuiltWallet } from "./InbuiltWalletContext"
import { api } from "@/lib/api-client"
import type { User } from "@/lib/api-client"

interface AuthContextType {
  user: User | null
  status: "loading" | "authenticated" | "unauthenticated"
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
  const sessionData = session?.data
  const sessionStatus = session?.status || "loading"

  const { address, createWallet } = useInbuiltWallet()
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")
  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      // Check if user is authenticated via NextAuth
      if (sessionStatus === "authenticated" && sessionData?.user) {
        try {
          // Try to get user from database by email
          let dbUser = null
          if (sessionData.user.email) {
            dbUser = await api.getUserByEmail(sessionData.user.email)
          }

          // If user doesn't exist, create one
          if (!dbUser && sessionData.user.email) {
            dbUser = await api.createUser({
              email: sessionData.user.email,
              name: sessionData.user.name || undefined,
              avatar_url: sessionData.user.image || undefined,
              twitter_id: (sessionData.user as any).twitter_id || undefined,
              wallet_address: address || undefined,
            })
          }

          if (dbUser) {
            // If user has a wallet address but it's not in the database, update it
            if (address && !dbUser.wallet_address) {
              dbUser = await api.updateUser(dbUser.id, { wallet_address: address })
            }

            setUser(dbUser)
            setStatus("authenticated")
          } else {
            // Fallback if database operations fail
            setUser({
              id: 0,
              email: sessionData.user.email || undefined,
              name: sessionData.user.name || undefined,
              avatar_url: sessionData.user.image || undefined,
              wallet_address: address || undefined,
              created_at: new Date(),
            })
            setStatus("authenticated")
          }
        } catch (error) {
          console.error("Error getting/creating user:", error)
          // Fallback
          setUser({
            id: 0,
            email: sessionData.user.email || undefined,
            name: sessionData.user.name || undefined,
            avatar_url: sessionData.user.image || undefined,
            wallet_address: address || undefined,
            created_at: new Date(),
          })
          setStatus("authenticated")
        }
      }
      // Check if user has a wallet connected
      else if (address) {
        try {
          // Try to get user from database by wallet address
          let dbUser = await api.getUserByWalletAddress(address)

          // If user doesn't exist, create one
          if (!dbUser) {
            dbUser = await api.createUser({
              wallet_address: address,
              name: `User ${address.substring(0, 6)}`,
            })
          }

          if (dbUser) {
            setUser(dbUser)
            setStatus("authenticated")
          } else {
            // Fallback if database operations fail
            setUser({
              id: 0,
              wallet_address: address,
              name: `User ${address.substring(0, 6)}`,
              created_at: new Date(),
            })
            setStatus("authenticated")
          }
        } catch (error) {
          console.error("Error getting/creating user:", error)
          // Fallback
          setUser({
            id: 0,
            wallet_address: address,
            name: `User ${address.substring(0, 6)}`,
            created_at: new Date(),
          })
          setStatus("authenticated")
        }
      }
      // No authentication
      else if (sessionStatus !== "loading") {
        setUser(null)
        setStatus("unauthenticated")
      }
    }

    loadUser()
  }, [sessionData, sessionStatus, address])

  const signInWithGoogle = async () => {
    try {
      await signIn("google", { callbackUrl: "/profile" })
    } catch (error) {
      console.error("Error signing in with Google:", error)
    }
  }

  const signInWithTwitter = async () => {
    try {
      await signIn("twitter", { callbackUrl: "/profile" })
    } catch (error) {
      console.error("Error signing in with Twitter:", error)
    }
  }

  const connectWallet = async () => {
    try {
      // If no wallet exists, create one
      if (!address) {
        await createWallet()
      }

      if (!address) {
        console.error("Failed to get wallet address after creation")
        return
      }

      console.log("Connecting wallet with address:", address)

      // Try to get user from database by wallet address
      let dbUser = null
      try {
        dbUser = await api.getUserByWalletAddress(address)
        console.log("Found existing user:", dbUser)
      } catch (error) {
        console.error("Error getting user by wallet address:", error)
      }

      // If user doesn't exist, create one
      if (!dbUser) {
        try {
          console.log("Creating new user with wallet address:", address)
          dbUser = await api.createUser({
            wallet_address: address,
            name: `User ${address.substring(0, 6)}`,
          })
          console.log("Created new user:", dbUser)
        } catch (error) {
          console.error("Error creating new user:", error)
        }
      }

      // Update user state
      if (dbUser) {
        setUser(dbUser)
      } else {
        // Fallback if database operations fail
        setUser({
          id: 0,
          wallet_address: address,
          name: `User ${address.substring(0, 6)}`,
          created_at: new Date(),
        })
      }

      setStatus("authenticated")
    } catch (error) {
      console.error("Error connecting wallet:", error)
    }
  }

  const logout = async () => {
    try {
      // Sign out from NextAuth
      await signOut({ redirect: false })

      // Clear user data
      setUser(null)
      setStatus("unauthenticated")

      // Redirect to home
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
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
