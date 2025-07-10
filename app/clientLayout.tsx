"use client"

import type React from "react"
import { SessionProvider } from "next-auth/react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </SessionProvider>
  )
}
