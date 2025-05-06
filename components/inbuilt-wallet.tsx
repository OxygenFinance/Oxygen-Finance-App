"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useInbuiltWallet } from "@/contexts/InbuiltWalletContext"
import { toast } from "react-toastify"
import { Eye, EyeOff } from "lucide-react"

export function InbuiltWallet() {
  const { createWallet, importWallet } = useInbuiltWallet()
  const [privateKey, setPrivateKey] = useState("")
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleCreateWallet = async () => {
    try {
      setIsCreating(true)
      await createWallet()
      toast.success("Wallet created successfully")
    } catch (error) {
      console.error("Error creating wallet:", error)
      toast.error("Failed to create wallet")
    } finally {
      setIsCreating(false)
    }
  }

  const handleImportWallet = async () => {
    if (!privateKey.trim()) {
      toast.error("Please enter a private key")
      return
    }

    try {
      setIsImporting(true)
      await importWallet(privateKey)
      toast.success("Wallet imported successfully")
    } catch (error) {
      console.error("Error importing wallet:", error)
      toast.error("Failed to import wallet. Please check your private key.")
    } finally {
      setIsImporting(false)
      setPrivateKey("")
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="create">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="create">Create New</TabsTrigger>
          <TabsTrigger value="import">Import Existing</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <div className="text-center text-gray-400 text-sm">
            <p>Create a new wallet to store your digital assets.</p>
            <p className="mt-2">
              Make sure to back up your private key once created. You'll need it to recover your wallet.
            </p>
          </div>

          <Button
            onClick={handleCreateWallet}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create New Wallet"}
          </Button>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <div className="text-center text-gray-400 text-sm">
            <p>Import an existing wallet using your private key.</p>
            <p className="mt-2">Your private key is never sent to our servers and is only stored locally.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="privateKey">Private Key</Label>
            <div className="relative">
              <Input
                id="privateKey"
                type={showPrivateKey ? "text" : "password"}
                placeholder="Enter your private key"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPrivateKey(!showPrivateKey)}
              >
                {showPrivateKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>

          <Button
            onClick={handleImportWallet}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            disabled={isImporting || !privateKey.trim()}
          >
            {isImporting ? "Importing..." : "Import Wallet"}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
