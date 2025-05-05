"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Header } from "@/components/Header"
// Make sure the import path for Footer is correct
import { Footer } from "@/components/Footer"
import { WalletProvider } from "@/contexts/WalletContext"
import { InbuiltWalletProvider } from "@/contexts/InbuiltWalletContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { FollowProvider } from "@/contexts/FollowContext"
import { SessionProvider } from "next-auth/react"
import { useEffect } from "react"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  useEffect(() => {
    console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL)
  }, [])

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <InbuiltWalletProvider>
            <WalletProvider>
              <AuthProvider>
                <FollowProvider>
                  <Header />
                  <main className="min-h-screen">{children}</main>
                  <Footer />
                  <ToastContainer position="bottom-right" />
                </FollowProvider>
              </AuthProvider>
            </WalletProvider>
          </InbuiltWalletProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
