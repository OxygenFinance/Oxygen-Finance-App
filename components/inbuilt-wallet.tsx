"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-toastify"
import { Copy, RefreshCw, ExternalLink } from "lucide-react"
import { useInbuiltWallet } from "@/contexts/InbuiltWalletContext"

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

interface InbuiltWalletProps {
  onConnect?: () => void
}

export function InbuiltWallet({ onConnect }: InbuiltWalletProps) {
  const {
    createWallet,
    importWallet,
    inbuiltAddress,
    inbuiltBalance,
    disconnectWallet: disconnectWalletContext,
    activeNetwork,
    privateKey,
    hasInbuiltWallet,
    isRecoveryEnabled,
    updateBalance,
    setActiveNetwork,
    setShowPrivateKey,
    showPrivateKey,
    isRefreshing,
  } = useInbuiltWallet()
  const [isCreating, setIsCreating] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importKey, setImportKey] = useState("")

  // Check for existing wallet on initial load
  useEffect(() => {
    // No longer needed as context handles this
  }, [])

  // Update balance when network changes
  useEffect(() => {
    if (inbuiltAddress) {
      updateBalance(inbuiltAddress)
    }
  }, [activeNetwork, inbuiltAddress, updateBalance])

  const handleCreateWallet = async () => {
    setIsCreating(true)
    try {
      await createWallet()
      if (onConnect) onConnect()
    } catch (error) {
      console.error("Error creating wallet:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleImportWallet = async () => {
    if (!importKey || !importKey.startsWith("0x") || importKey.length !== 66) {
      toast.error("Please enter a valid private key")
      return
    }

    setIsImporting(true)
    try {
      await importWallet(importKey)
      if (onConnect) onConnect()
    } catch (error) {
      console.error("Error importing wallet:", error)
      toast.error("Invalid private key")
    } finally {
      setIsImporting(false)
    }
  }

  const disconnectWallet = () => {
    disconnectWalletContext()
    toast.success("Wallet disconnected")
  }

  const copyAddress = () => {
    if (inbuiltAddress) {
      navigator.clipboard.writeText(inbuiltAddress)
      toast.success("Address copied to clipboard")
    }
  }

  const copyPrivateKey = () => {
    if (privateKey) {
      navigator.clipboard.writeText(privateKey)
      toast.success("Private key copied to clipboard")
      toast.warning("Never share your private key with anyone!", {
        autoClose: 10000,
      })
    }
  }

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const refreshBalance = async () => {
    if (inbuiltAddress) {
      toast.info(`Refreshing ${activeNetwork.symbol} balance...`)
      await updateBalance(inbuiltAddress)
    }
  }

  const switchNetwork = (chainId: number) => {
    if (!networks[chainId]) {
      toast.error("Invalid network")
      return
    }

    if (!inbuiltAddress) {
      toast.error("No wallet connected")
      return
    }

    setActiveNetwork(networks[chainId])
    localStorage.setItem(`${inbuiltAddress}-network`, chainId.toString())
    updateBalance(inbuiltAddress)
    toast.success(`Switched to ${networks[chainId].name}`)
  }

  const viewOnExplorer = () => {
    if (inbuiltAddress) {
      window.open(`${activeNetwork.blockExplorerUrl}/address/${inbuiltAddress}`, "_blank")
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle>Wallet</CardTitle>
        <CardDescription className="text-gray-400">Manage your crypto wallet</CardDescription>
      </CardHeader>
      <CardContent>
        {inbuiltAddress ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">Wallet Address</p>
                <p className="font-mono">{truncateAddress(inbuiltAddress)}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="border-gray-600" onClick={copyAddress}>
                  <Copy size={16} />
                </Button>
                <Button variant="outline" size="sm" className="border-gray-600" onClick={viewOnExplorer}>
                  <ExternalLink size={16} />
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">Balance</p>
                <p className="font-bold text-xl">
                  {isRefreshing ? (
                    <span className="flex items-center">
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    `${Number(inbuiltBalance).toFixed(6)} ${activeNetwork.symbol}`
                  )}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600"
                onClick={refreshBalance}
                disabled={isRefreshing}
              >
                <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
              </Button>
            </div>

            <div>
              <p className="text-sm text-gray-400">Network</p>
              <div className="flex items-center mt-1">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span>{activeNetwork.name}</span>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-gray-400 mb-2">Switch Network</p>
              <div className="flex flex-wrap gap-2">
                {activeNetwork.chainId !== 137 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
                    onClick={() => switchNetwork(137)}
                  >
                    Polygon
                  </Button>
                )}
                {activeNetwork.chainId !== 1231 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                    onClick={() => switchNetwork(1231)}
                  >
                    Unichain
                  </Button>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-400">Private Key (Keep Secret!)</p>
                <Button variant="ghost" size="sm" onClick={() => setShowPrivateKey(!showPrivateKey)}>
                  {showPrivateKey ? "Hide" : "Show"}
                </Button>
              </div>

              {showPrivateKey && privateKey && (
                <div className="relative">
                  <Input value={privateKey} readOnly className="bg-gray-800 border-gray-700 pr-20 font-mono text-xs" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={copyPrivateKey}
                  >
                    Copy
                  </Button>
                </div>
              )}

              <p className="text-xs text-red-500 mt-2">
                Warning: Never share your private key with anyone. Anyone with your private key has full access to your
                funds.
              </p>
            </div>

            <Button variant="destructive" className="w-full mt-4" onClick={disconnectWallet}>
              Disconnect Wallet
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-center text-gray-400">Create a new wallet or import an existing one</p>

              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onClick={handleCreateWallet}
                disabled={isCreating}
              >
                {isCreating ? (
                  <div className="flex items-center">
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                    Creating...
                  </div>
                ) : (
                  "Create New Wallet"
                )}
              </Button>
            </div>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-700"></div>
              <span className="mx-4 text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-700"></div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="privateKey">Import with Private Key</Label>
                <Input
                  id="privateKey"
                  type="password"
                  placeholder="0x..."
                  value={importKey}
                  onChange={(e) => setImportKey(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <Button
                variant="outline"
                className="w-full border-gray-600"
                onClick={handleImportWallet}
                disabled={isImporting}
              >
                {isImporting ? (
                  <div className="flex items-center">
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                    Importing...
                  </div>
                ) : (
                  "Import Wallet"
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
