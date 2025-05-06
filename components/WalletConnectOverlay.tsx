"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InbuiltWallet } from "./inbuilt-wallet"
import { useInbuiltWallet } from "@/contexts/InbuiltWalletContext"

interface WalletConnectOverlayProps {
  onClose: () => void
}

export function WalletConnectOverlay({ onClose }: WalletConnectOverlayProps) {
  const { address } = useInbuiltWallet()
  const [activeTab, setActiveTab] = useState<"inbuilt" | "external">("inbuilt")

  // If wallet is connected, close the overlay
  if (address) {
    onClose()
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-lg border border-gray-700 shadow-xl w-full max-w-md relative"
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X size={20} />
          </Button>

          <div className="p-6">
            <h2 className="text-2xl font-bold text-center mb-2">Connect Your Wallet</h2>
            <p className="text-gray-400 text-center mb-6">Connect or create a wallet to start using Oxygen Finance</p>

            <div className="flex mb-6">
              <button
                className={`flex-1 py-2 text-center ${
                  activeTab === "inbuilt"
                    ? "text-white border-b-2 border-purple-500"
                    : "text-gray-400 border-b border-gray-700"
                }`}
                onClick={() => setActiveTab("inbuilt")}
              >
                Inbuilt Wallet
              </button>
              <button
                className={`flex-1 py-2 text-center ${
                  activeTab === "external"
                    ? "text-white border-b-2 border-purple-500"
                    : "text-gray-400 border-b border-gray-700"
                }`}
                onClick={() => setActiveTab("external")}
              >
                External Wallet
              </button>
            </div>

            {activeTab === "inbuilt" ? (
              <InbuiltWallet />
            ) : (
              <div className="space-y-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">MetaMask</Button>
                <Button className="w-full bg-blue-800 hover:bg-blue-900">WalletConnect</Button>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Coinbase Wallet</Button>
              </div>
            )}

            <p className="text-xs text-gray-500 text-center mt-6">
              By connecting a wallet, you agree to Oxygen Finance's Terms of Service and Privacy Policy
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
