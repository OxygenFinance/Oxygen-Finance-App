"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InbuiltWallet } from "./inbuilt-wallet"
import { useInbuiltWallet } from "@/contexts/InbuiltWalletContext"
import { Copy, ExternalLink, RefreshCw } from "lucide-react"
import { toast } from "react-toastify"

export function WalletManager() {
  const { address, balance, disconnectWallet } = useInbuiltWallet()
  const [activeTab, setActiveTab] = useState<"inbuilt" | "external">("inbuilt")

  const truncateAddress = (address: string | null) => {
    if (!address) return ""
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success("Address copied to clipboard")
    }
  }

  const viewOnExplorer = () => {
    if (address) {
      window.open(`https://polygonscan.com/address/${address}`, "_blank")
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle>Wallet Manager</CardTitle>
        <CardDescription className="text-gray-400">Manage your crypto wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "inbuilt" | "external")}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="inbuilt">Inbuilt Wallet</TabsTrigger>
            <TabsTrigger value="external">External Wallet</TabsTrigger>
          </TabsList>

          <TabsContent value="inbuilt">
            {address ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-400">Wallet Address</p>
                    <p className="font-mono">{truncateAddress(address)}</p>
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
                    <p className="font-bold text-xl">{balance} MATIC</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-600">
                    <RefreshCw size={16} />
                  </Button>
                </div>

                <Button variant="destructive" className="w-full mt-4" onClick={disconnectWallet}>
                  Disconnect Wallet
                </Button>
              </div>
            ) : (
              <InbuiltWallet />
            )}
          </TabsContent>

          <TabsContent value="external">
            <div className="space-y-4">
              <p className="text-center text-gray-400 mb-4">Connect with your existing wallet</p>

              <Button className="w-full bg-blue-600 hover:bg-blue-700">MetaMask</Button>

              <Button className="w-full bg-blue-800 hover:bg-blue-900">WalletConnect</Button>

              <Button className="w-full bg-purple-600 hover:bg-purple-700">Coinbase Wallet</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
