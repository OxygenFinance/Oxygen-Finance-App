"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { InbuiltWalletProvider } from "@/contexts/InbuiltWalletContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { FollowProvider } from "@/contexts/FollowContext"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <InbuiltWalletProvider>
        <AuthProvider>
          <FollowProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
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
    </SessionProvider>
  )
}
