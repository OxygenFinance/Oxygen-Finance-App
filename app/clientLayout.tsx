"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { WalletConnectOverlay } from "@/components/WalletConnectOverlay"
import { useInbuiltWallet } from "@/contexts/InbuiltWalletContext"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { address } = useInbuiltWallet()
  const [showWalletOverlay, setShowWalletOverlay] = useState(false)

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem("hasVisitedBefore")

    if (!hasVisited && !address) {
      // Show wallet overlay after a short delay for new users
      const timer = setTimeout(() => {
        setShowWalletOverlay(true)
      }, 3000)

      return () => clearTimeout(timer)
    }

    // Mark as visited
    localStorage.setItem("hasVisitedBefore", "true")
  }, [address])

  const closeWalletOverlay = () => {
    setShowWalletOverlay(false)
  }

  return (
    <>
      {children}
      {showWalletOverlay && <WalletConnectOverlay onClose={closeWalletOverlay} />}
    </>
  )
}
