"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useSession, signIn, signOut } from "next-auth/react"
import { useInbuiltWallet } from "./InbuiltWalletContext"
import { getUserByWalletAddress, createUser, updateUser, getUserByEmail } from "@/lib/api-client"
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
  const { data: session, status: sessionStatus } = useSession()
  const { address, createWallet } = useInbuiltWallet()
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")
  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      // Check if user is authenticated via NextAuth
      if (sessionStatus === "authenticated" && session?.user) {
        try {
          // Try to get user from database by email
          let dbUser = null
          if (session.user.email) {
            dbUser = await getUserByEmail(session.user.email)
          }

          // If user doesn't exist, create one
          if (!dbUser && session.user.email) {
            dbUser = await createUser({
              email: session.user.email,
              name: session.user.name || undefined,
              avatar_url: session.user.image || undefined,
              twitter_id: (session.user as any).twitter_id || undefined,
              wallet_address: address || undefined,
            })
          }

          if (dbUser) {
            // If user has a wallet address but it's not in the database, update it
            if (address && !dbUser.wallet_address) {
              dbUser = await updateUser(dbUser.id, { wallet_address: address })
            }

            setUser(dbUser)
            setStatus("authenticated")
          } else {
            // Fallback if database operations fail
            setUser({
              id: 0,
              email: session.user.email || undefined,
              name: session.user.name || undefined,
              avatar_url: session.user.image || undefined,
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
            email: session.user.email || undefined,
            name: session.user.name || undefined,
            avatar_url: session.user.image || undefined,
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
          let dbUser = await getUserByWalletAddress(address)

          // If user doesn't exist, create one
          if (!dbUser) {
            dbUser = await createUser({
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
  }, [session, sessionStatus, address])

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

      // Update user with wallet address
      if (user) {
        const updatedUser = await updateUser(user.id, { wallet_address: address })
        if (updatedUser) {
          setUser(updatedUser)
        } else {
          setUser({
            ...user,
            wallet_address: address,
          })
        }
      } else {
        // Try to get user from database by wallet address
        try {
          let dbUser = await getUserByWalletAddress(address || "")

          // If user doesn't exist, create one
          if (!dbUser && address) {
            dbUser = await createUser({
              wallet_address: address,
              name: `User ${address.substring(0, 6)}`,
            })
          }

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
        } catch (error) {
          console.error("Error getting/creating user:", error)
          // Fallback
          setUser({
            id: 0,
            wallet_address: address,
            name: `User ${address.substring(0, 6)}`,
            created_at: new Date(),
          })
        }
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
