"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { WalletConnectOverlay } from "@/components/WalletConnectOverlay"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

interface WalletContextType {
  address: string | null
  isConnecting: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [showConnectOverlay, setShowConnectOverlay] = useState(false)
  const [balance, setBalance] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [walletType, setWalletType] = useState<string | null>(null)
  const router = useRouter()

  // Check for existing connection on initial load
  useEffect(() => {
    const checkConnection = async () => {
      // First check for inbuilt wallet
      const inbuiltWallet = localStorage.getItem("inbuiltWallet")
      if (inbuiltWallet) {
        try {
          const parsedWallet = JSON.parse(inbuiltWallet)
          setAddress(parsedWallet.address)
          setWalletType("inbuilt")
          return
        } catch (error) {
          console.error("Error parsing inbuilt wallet:", error)
        }
      }

      // Then check for user data
      const userData = localStorage.getItem("user")
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData)
          if (parsedUser.walletAddress) {
            setAddress(parsedUser.walletAddress)
            setWalletType(parsedUser.walletType || "external")
          }
        } catch (error) {
          console.error("Error parsing user data:", error)
        }
      }
    }

    checkConnection()

    // Set up event listeners for wallet events
    const handleConnectWalletEvent = () => {
      setShowConnectOverlay(true)
    }

    const handleDisconnectWalletEvent = () => {
      disconnectWallet()
    }

    const handleWalletConnectedEvent = (event: CustomEvent) => {
      const userData = event.detail
      if (userData && userData.walletAddress) {
        setAddress(userData.walletAddress)
        setWalletType(userData.walletType || "external")
      }
    }

    window.addEventListener("connect-wallet", handleConnectWalletEvent)
    window.addEventListener("disconnect-wallet", handleDisconnectWalletEvent)
    window.addEventListener("wallet-connected", handleWalletConnectedEvent as EventListener)

    // Clean up event listeners
    return () => {
      window.removeEventListener("connect-wallet", handleConnectWalletEvent)
      window.removeEventListener("disconnect-wallet", handleDisconnectWalletEvent)
      window.removeEventListener("wallet-connected", handleWalletConnectedEvent as EventListener)
    }
  }, [])

  const connectWallet = async () => {
    setShowConnectOverlay(true)
  }

  // Update the disconnectWallet function to properly clean up
  const disconnectWallet = () => {
    // Clear wallet data
    setAddress(null)
    setBalance(null)
    setChainId(null)
    setWalletType(null)

    // Clear localStorage wallet data
    localStorage.removeItem("walletAddress")
    localStorage.removeItem("walletType")
    localStorage.removeItem("inbuiltWallet")
    localStorage.removeItem("user")

    // Dispatch event for other contexts to respond
    window.dispatchEvent(new CustomEvent("disconnect-wallet"))

    // Show success message
    toast.success("Wallet disconnected successfully!")

    // Redirect to homepage
    router.push("/")
  }

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnecting,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
      <WalletConnectOverlay isOpen={showConnectOverlay} onClose={() => setShowConnectOverlay(false)} />
    </WalletContext.Provider>
  )
}
