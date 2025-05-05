"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useSession } from "next-auth/react"

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, status, connectWallet, logout } = useAuth()
  const { data: session } = useSession()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const truncateAddress = (address: string | null) => {
    if (!address) return "Connect Wallet"
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const navigateToProfile = () => {
    router.push("/profile")
  }

  const handleLogout = () => {
    logout() // This will now handle the redirection to homepage
  }

  // Determine if user is authenticated based on either NextAuth session or local storage
  const isAuthenticated = !!session || status === "authenticated"

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || pathname !== "/" ? "bg-black bg-opacity-80 backdrop-blur-md py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center">
              <img src="/logo.png" alt="Oxygen Finance Logo" className="h-10 mr-3" />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Oxygen Finance
              </h1>
            </div>
          </Link>
        </div>
        {/* Navigation */}
        <nav className="flex items-center space-x-4">
          <Link href="/gallery" className="hover:text-pink-400 transition-colors">
            Gallery
          </Link>
          <Link href="/creators" className="hover:text-pink-400 transition-colors">
            Creators
          </Link>
          <Link href="/create" className="hover:text-pink-400 transition-colors">
            Create
          </Link>
          {isAuthenticated && user?.walletAddress ? (
            <>
              <Button
                onClick={navigateToProfile}
                variant="outline"
                className="border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white flex items-center"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button onClick={handleLogout} variant="outline" className="border-gray-500 text-gray-300">
                {truncateAddress(user.walletAddress)}
              </Button>
            </>
          ) : (
            <Button
              onClick={connectWallet}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Connect Wallet
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
