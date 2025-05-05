"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { InbuiltWallet } from "./inbuilt-wallet"
import { X } from "lucide-react"

interface WalletConnectOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function WalletConnectOverlay({ isOpen, onClose }: WalletConnectOverlayProps) {
  const [activeTab, setActiveTab] = useState<"inbuilt" | "external">("inbuilt")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-lg w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Connect Wallet</h2>

        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "inbuilt"
                ? "border-b-2 border-purple-500 text-purple-500"
                : "border-b border-gray-700 text-gray-400"
            }`}
            onClick={() => setActiveTab("inbuilt")}
          >
            Inbuilt Wallet
          </button>
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "external"
                ? "border-b-2 border-purple-500 text-purple-500"
                : "border-b border-gray-700 text-gray-400"
            }`}
            onClick={() => setActiveTab("external")}
          >
            External Wallet
          </button>
        </div>

        {activeTab === "inbuilt" ? (
          <div>
            <InbuiltWallet onConnect={onClose} />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-gray-400 mb-4">Connect with your existing wallet</p>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                // Simulate MetaMask connection
                setTimeout(() => {
                  onClose()
                }, 500)
              }}
            >
              MetaMask
            </Button>

            <Button
              className="w-full bg-blue-800 hover:bg-blue-900"
              onClick={() => {
                // Simulate WalletConnect connection
                setTimeout(() => {
                  onClose()
                }, 500)
              }}
            >
              WalletConnect
            </Button>

            <Button
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => {
                // Simulate Coinbase Wallet connection
                setTimeout(() => {
                  onClose()
                }, 500)
              }}
            >
              Coinbase Wallet
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
