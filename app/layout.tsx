import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { InbuiltWalletProvider } from "@/contexts/InbuiltWalletContext"
import { FollowProvider } from "@/contexts/FollowContext"
import ClientLayout from "./clientLayout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Oxygen Finance",
  description: "A Web3 platform for digital art and NFTs",
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
              <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
              />
            </FollowProvider>
          </AuthProvider>
        </InbuiltWalletProvider>
      </body>
    </html>
  )
}
