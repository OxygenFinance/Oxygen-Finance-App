"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ethers } from "ethers"
import { createUser, getUserByWalletAddress } from "@/lib/api-client"

// Define network configurations
const networks: Record<number, Network> = {
  137: {
    name: "Polygon Mainnet",
    chainId: 137,
    rpcUrl: "https://polygon-rpc.com",
    symbol: "POL",
    blockExplorerUrl: "https://polygonscan.com",
    explorerApiUrl: "https://api.polygonscan.com/api",
    explorerApiKey: "YourPolygonScanApiKey", // Replace with your actual API key
  },
  1231: {
    name: "Unichain Mainnet",
    chainId: 1231,
    rpcUrl: "https://rpc-mainnet.unichain.network",
    symbol: "ETH",
    blockExplorerUrl: "https://scan.unichain.network",
    explorerApiUrl: "https://scan.unichain.network/api",
    explorerApiKey: "YourUnichainApiKey", // Replace with your actual API key
  },
}

interface Network {
  name: string
  chainId: number
  rpcUrl: string
  symbol: string
  blockExplorerUrl: string
  explorerApiUrl: string
  explorerApiKey: string
}

interface InbuiltWalletContextType {
  wallet: ethers.Wallet | null
  address: string | null
  inbuiltAddress: string | null
  inbuiltBalance: string
  privateKey: string | null
  activeNetwork: Network
  hasInbuiltWallet: boolean
  isRecoveryEnabled: boolean
  showPrivateKey: boolean
  isRefreshing: boolean
  createWallet: () => Promise<ethers.Wallet | string | undefined>
  importWallet: (privateKey: string) => Promise<ethers.Wallet | string | undefined>
  disconnectWallet: () => void
  updateBalance: (address: string) => Promise<void>
  setActiveNetwork: (network: Network) => void
  setShowPrivateKey: (show: boolean) => void
}

const InbuiltWalletContext = createContext<InbuiltWalletContextType | undefined>(undefined)

export function useInbuiltWallet() {
  const context = useContext(InbuiltWalletContext)
  if (context === undefined) {
    throw new Error("useInbuiltWallet must be used within an InbuiltWalletProvider")
  }
  return context
}

export function InbuiltWalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [inbuiltAddress, setInbuiltAddress] = useState<string | null>(null)
  const [inbuiltBalance, setInbuiltBalance] = useState<string>("0")
  const [privateKey, setPrivateKey] = useState<string | null>(null)
  const [activeNetwork, setActiveNetwork] = useState<Network>(networks[137])
  const [hasInbuiltWallet, setHasInbuiltWallet] = useState<boolean>(false)
  const [isRecoveryEnabled, setIsRecoveryEnabled] = useState<boolean>(false)
  const [showPrivateKey, setShowPrivateKey] = useState<boolean>(false)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

  useEffect(() => {
    // Check for existing wallet in localStorage
    const storedWallet = localStorage.getItem("inbuiltWallet")
    if (storedWallet) {
      try {
        const walletData = JSON.parse(storedWallet)
        const loadedWallet = new ethers.Wallet(walletData.privateKey)
        setWallet(loadedWallet)
        setAddress(loadedWallet.address)
        setInbuiltAddress(loadedWallet.address)
        setPrivateKey(loadedWallet.privateKey)
        setHasInbuiltWallet(true)

        // Check if recovery is enabled
        const linkedAccounts = localStorage.getItem(`${loadedWallet.address}-socialAccounts`)
        if (linkedAccounts) {
          const accounts = JSON.parse(linkedAccounts)
          setIsRecoveryEnabled(accounts.some((a: any) => a.provider === "google"))
        }

        // Get active network from localStorage or default to Polygon
        const savedNetwork = localStorage.getItem(`${loadedWallet.address}-network`)
        if (savedNetwork) {
          const networkId = Number.parseInt(savedNetwork)
          if (networks[networkId]) {
            setActiveNetwork(networks[networkId])
          }
        }

        // Fetch balance
        updateBalance(loadedWallet.address)
      } catch (error) {
        console.error("Error loading wallet:", error)
      }
    }
  }, [])

  const createWallet = async () => {
    try {
      // Generate a new wallet
      const wallet = ethers.Wallet.createRandom()
      const privateKey = wallet.privateKey
      const address = wallet.address

      // Save to local storage
      localStorage.setItem("inbuiltWalletPrivateKey", privateKey)
      localStorage.setItem("inbuiltWalletAddress", address)

      // Set state
      setPrivateKey(privateKey)
      setInbuiltAddress(address)
      setHasInbuiltWallet(true)
      setShowPrivateKey(false)

      // Create user in database if it doesn't exist
      try {
        // Check if user already exists
        const existingUser = await getUserByWalletAddress(address)

        if (!existingUser) {
          // Create new user
          await createUser({
            wallet_address: address,
            name: `User ${address.substring(0, 6)}`,
          })
          console.log("Created new user in database for wallet:", address)
        }
      } catch (error) {
        console.error("Error creating user in database:", error)
      }

      // Update balance
      await updateBalance(address)

      return address
    } catch (error) {
      console.error("Error creating wallet:", error)
      throw error
    }
  }

  const importWallet = async (importedPrivateKey: string) => {
    try {
      // Validate private key
      if (!importedPrivateKey.startsWith("0x") || importedPrivateKey.length !== 66) {
        throw new Error("Invalid private key format")
      }

      // Create wallet from private key
      const wallet = new ethers.Wallet(importedPrivateKey)
      const address = wallet.address

      // Save to local storage
      localStorage.setItem("inbuiltWalletPrivateKey", importedPrivateKey)
      localStorage.setItem("inbuiltWalletAddress", address)

      // Set state
      setPrivateKey(importedPrivateKey)
      setInbuiltAddress(address)
      setHasInbuiltWallet(true)
      setShowPrivateKey(false)

      // Create user in database if it doesn't exist
      try {
        // Check if user already exists
        const existingUser = await getUserByWalletAddress(address)

        if (!existingUser) {
          // Create new user
          await createUser({
            wallet_address: address,
            name: `User ${address.substring(0, 6)}`,
          })
          console.log("Created new user in database for imported wallet:", address)
        }
      } catch (error) {
        console.error("Error creating user in database:", error)
      }

      // Update balance
      await updateBalance(address)

      return address
    } catch (error) {
      console.error("Error importing wallet:", error)
      throw error
    }
  }

  const disconnectWallet = () => {
    setWallet(null)
    setAddress(null)
    setInbuiltAddress(null)
    setPrivateKey(null)
    setInbuiltBalance("0")
    setHasInbuiltWallet(false)
    setIsRecoveryEnabled(false)
    localStorage.removeItem("inbuiltWallet")
    localStorage.removeItem("walletAddress")
    localStorage.removeItem("walletType")
  }

  const updateBalance = async (address: string) => {
    try {
      setIsRefreshing(true)
      // Try to get real balance from blockchain explorer
      let balance = "0"

      try {
        if (activeNetwork.chainId === 137) {
          // Fetch from Polygonscan
          const response = await fetch(
            `${activeNetwork.explorerApiUrl}?module=account&action=balance&address=${address}&apikey=${activeNetwork.explorerApiKey}`,
          )
          const data = await response.json()

          if (data.status === "1") {
            balance = ethers.formatEther(data.result)
          } else {
            // Fallback to RPC
            const provider = new ethers.JsonRpcProvider(activeNetwork.rpcUrl)
            const balanceWei = await provider.getBalance(address)
            balance = ethers.formatEther(balanceWei)
          }
        } else if (activeNetwork.chainId === 1231) {
          // Fetch from Unichain explorer
          try {
            const provider = new ethers.JsonRpcProvider(activeNetwork.rpcUrl)
            const balanceWei = await provider.getBalance(address)
            balance = ethers.formatEther(balanceWei)
          } catch (error) {
            console.error("Error fetching Unichain balance via RPC:", error)
            // Fallback to stored balance
            const balanceKey = `balance_${address}_${activeNetwork.chainId}`
            const storedBalance = localStorage.getItem(balanceKey)
            if (storedBalance) {
              balance = storedBalance
            }
          }
        }
      } catch (error) {
        console.error("Error fetching real balance:", error)

        // Fallback to stored balance
        const balanceKey = `balance_${address}_${activeNetwork.chainId}`
        const storedBalance = localStorage.getItem(balanceKey)
        if (storedBalance) {
          balance = storedBalance
        }
      }

      setInbuiltBalance(balance)

      // Store the balance
      localStorage.setItem(`balance_${address}_${activeNetwork.chainId}`, balance)
    } catch (error) {
      console.error("Error updating balance:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <InbuiltWalletContext.Provider
      value={{
        wallet,
        address,
        inbuiltAddress,
        inbuiltBalance,
        privateKey,
        activeNetwork,
        hasInbuiltWallet,
        isRecoveryEnabled,
        showPrivateKey,
        isRefreshing,
        createWallet,
        importWallet,
        disconnectWallet,
        updateBalance,
        setActiveNetwork,
        setShowPrivateKey,
      }}
    >
      {children}
    </InbuiltWalletContext.Provider>
  )
}
