import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Oxygen Finance - Video HUB",
  description: "A Web3 platform for video content creators",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-black text-white">
          <header className="border-b border-gray-800 p-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
                <span className="text-xl font-bold">Oxygen Finance</span>
              </div>
              <nav className="flex space-x-6">
                <a href="/" className="hover:text-purple-400">
                  Home
                </a>
                <a href="/gallery" className="hover:text-purple-400">
                  Gallery
                </a>
                <a href="/creators" className="hover:text-purple-400">
                  Creators
                </a>
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className="border-t border-gray-800 p-4 mt-20">
            <div className="text-center text-gray-400">© 2024 Oxygen Finance. All rights reserved.</div>
          </footer>
        </div>
      </body>
    </html>
  )
}
