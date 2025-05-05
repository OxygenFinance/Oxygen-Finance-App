"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ethers } from "ethers"

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
  createWallet: () => Promise<ethers.Wallet>
  importWallet: (privateKey: string) => Promise<ethers.Wallet>
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
      // Create a new wallet
      const newWallet = ethers.Wallet.createRandom()

      // Save to state
      setWallet(newWallet)
      setAddress(newWallet.address)
      setInbuiltAddress(newWallet.address)
      setPrivateKey(newWallet.privateKey)
      setHasInbuiltWallet(true)
      setIsRecoveryEnabled(false)

      // Save to localStorage
      localStorage.setItem(
        "inbuiltWallet",
        JSON.stringify({
          address: newWallet.address,
          privateKey: newWallet.privateKey,
        }),
      )

      // Set default network to Polygon
      localStorage.setItem(`${newWallet.address}-network`, "137")

      // Fetch balance
      updateBalance(newWallet.address)

      return newWallet
    } catch (error) {
      console.error("Error creating wallet:", error)
      throw error
    }
  }

  const importWallet = async (privateKey: string) => {
    try {
      // Create wallet from private key
      const importedWallet = new ethers.Wallet(privateKey)

      // Save to state
      setWallet(importedWallet)
      setAddress(importedWallet.address)
      setInbuiltAddress(importedWallet.address)
      setPrivateKey(importedWallet.privateKey)
      setHasInbuiltWallet(true)
      setIsRecoveryEnabled(false)

      // Save to localStorage
      localStorage.setItem(
        "inbuiltWallet",
        JSON.stringify({
          address: importedWallet.address,
          privateKey: importedWallet.privateKey,
        }),
      )

      // Set default network to Polygon
      localStorage.setItem(`${importedWallet.address}-network`, "137")

      // Fetch balance
      updateBalance(importedWallet.address)

      return importedWallet
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
