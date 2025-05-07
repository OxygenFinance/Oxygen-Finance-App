"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { usePathname } from "next/navigation"
import { WalletConnectOverlay } from "@/components/WalletConnectOverlay"
import { useInbuiltWallet } from "@/contexts/InbuiltWalletContext"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { showWalletConnect, setShowWalletConnect } = useInbuiltWallet()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return null
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-white">{children}</main>
      <Footer />
      {showWalletConnect && <WalletConnectOverlay onClose={() => setShowWalletConnect(false)} />}
    </>
  )
}
