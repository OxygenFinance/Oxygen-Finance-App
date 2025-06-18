import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { InbuiltWalletProvider } from "@/contexts/InbuiltWalletContext"
import { FollowProvider } from "@/contexts/FollowContext"
import ClientLayout from "./clientLayout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Oxygen Finance - Video HUB",
  description: "A Web3 platform for video content creators",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <InbuiltWalletProvider>
          <AuthProvider>
            <FollowProvider>
              <ClientLayout>{children}</ClientLayout>
            </FollowProvider>
          </AuthProvider>
        </InbuiltWalletProvider>
      </body>
    </html>
  )
}
