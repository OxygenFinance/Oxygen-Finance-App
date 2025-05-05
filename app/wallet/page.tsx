"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletManager } from "@/components/WalletManager"
import { DatabaseStatus } from "@/components/DatabaseStatus"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Wallet, Database, ArrowLeft } from "lucide-react"

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("wallet")

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-900/20 text-white">
      <ToastContainer position="top-right" theme="dark" />

      <header className="bg-black bg-opacity-50 backdrop-blur-md py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center">
              <img src="/logo.png" alt="Oxygen Finance Logo" className="h-8 mr-2" />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Oxygen Finance
              </h1>
            </div>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/" className="hover:text-pink-400 transition-colors">
              <Button variant="outline" className="border-gray-600">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 flex items-center">
          <Wallet className="mr-3 h-8 w-8" />
          Wallet & Database Management
        </h2>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 gap-2">
            <TabsTrigger value="wallet" className="flex items-center justify-center">
              <Wallet className="mr-2 h-4 w-4" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center justify-center">
              <Database className="mr-2 h-4 w-4" />
              Database
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="space-y-4">
            <WalletManager />

            <Card className="bg-gray-800 border-gray-700 mt-6">
              <CardHeader>
                <CardTitle>Wallet Information</CardTitle>
                <CardDescription className="text-gray-400">Important details about your wallet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-amber-900/30 border border-amber-700 rounded-md p-4">
                  <h3 className="font-semibold text-amber-500 mb-2">About This Wallet</h3>
                  <p className="text-sm text-amber-300/90">
                    This is a real Ethereum-compatible wallet that generates a cryptographically secure private key. The
                    private key is stored in your browser's localStorage and can be exported to any external wallet.
                  </p>
                  <p className="text-sm text-amber-300/90 mt-2">For security reasons, we strongly recommend:</p>
                  <ul className="list-disc list-inside text-sm text-amber-300/90 mt-1 space-y-1">
                    <li>Enabling wallet recovery by linking your Google account</li>
                    <li>Backing up your private key in a secure location</li>
                    <li>Never sharing your private key with anyone</li>
                  </ul>
                </div>

                <div className="bg-gray-700 p-4 rounded-md">
                  <h3 className="font-semibold mb-2">Supported Networks</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mt-1.5 mr-2"></div>
                      <div>
                        <p className="font-medium">Polygon Mainnet</p>
                        <p className="text-sm text-gray-400">Native token: POL</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                      <div>
                        <p className="font-medium">Unichain Mainnet</p>
                        <p className="text-sm text-gray-400">Native token: ETH</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            <DatabaseStatus />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
