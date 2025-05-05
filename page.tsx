"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, ArrowDown, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/WalletContext"

export default function Home() {
  const { address, connectWallet, disconnectWallet } = useWallet()
  const [scrolled, setScrolled] = useState(false)
  const [entered, setEntered] = useState(false)
  const entranceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleEnterGallery = () => {
    setEntered(true)
    setTimeout(() => {
      if (entranceRef.current) {
        entranceRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }, 500)
  }

  const truncateAddress = (address: string | null) => {
    if (!address) return "Connect Wallet"
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-black bg-opacity-80 backdrop-blur-md py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Oxygen Finance
          </h1>
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
            <Link href="/profile">
              <Button
                variant="outline"
                className="border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white flex items-center"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </Link>
            {address ? (
              <Button onClick={disconnectWallet} variant="outline" className="border-gray-500 text-gray-300">
                {truncateAddress(address)}
              </Button>
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

      {/* Hero Section with 3D Building Entrance */}
      <section className="h-screen relative flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-blue-900/20 to-black z-10"></div>
          <video autoPlay muted loop playsInline className="absolute w-full h-full object-cover">
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        <div className="container mx-auto px-4 z-20 text-center">
          <motion.h2
            className="text-5xl md:text-7xl font-extrabold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Digital Video{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">HUB</span>
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Step into our virtual gallery showcasing the finest digital videos and comics from creators around the world
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              onClick={handleEnterGallery}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-6"
              size="lg"
            >
              Enter Gallery <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <ArrowDown className="animate-bounce text-white/70" />
        </motion.div>
      </section>

      {/* 3D Building Entrance */}
      <div ref={entranceRef}>
        <motion.section
          className={`relative h-screen perspective-1000 transition-all duration-1000 ${entered ? "opacity-100" : "opacity-0"}`}
        >
          <div className="absolute inset-0 bg-black">
            <div className="building-entrance">
              <div className="floor"></div>
              <div className="ceiling"></div>
              <div className="left-wall"></div>
              <div className="right-wall"></div>
              <div className="back-wall">
                <div className="doorway">
                  <Link href="/gallery">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-6 animate-pulse">
                      Enter Gallery
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Featured Artists Section */}
      <section className="py-20 bg-gradient-to-b from-black to-purple-900/20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Featured Artists</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArtists.map((artist, index) => (
              <motion.div
                key={artist.id}
                className="bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={artist.image || "/placeholder.svg"}
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{artist.name}</h3>
                  <p className="text-gray-400 mb-4">{artist.bio}</p>
                  <Link href={`/creator/${artist.id}`}>
                    <Button
                      variant="outline"
                      className="w-full border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
                    >
                      View Gallery
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/creators">
              <Button variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white">
                View All Artists
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Oxygen Finance
              </h3>
              <p className="text-gray-400 mt-2">The future of digital art galleries</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/gallery" className="text-gray-400 hover:text-white transition-colors">
                Gallery
              </Link>
              <Link href="/creators" className="text-gray-400 hover:text-white transition-colors">
                Creators
              </Link>
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Oxygen Finance. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Custom CSS for 3D effects */}
      <style jsx>{`
      .perspective-1000 {
        perspective: 1000px;
      }
      
      .building-entrance {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80vw;
        max-width: 1200px;
        height: 70vh;
        transform-style: preserve-3d;
        animation: entrance 3s ease-out forwards;
      }
      
      @keyframes entrance {
        0% {
          transform: translate(-50%, -50%) rotateX(5deg) translateZ(-100px);
        }
        100% {
          transform: translate(-50%, -50%) rotateX(0deg) translateZ(0);
        }
      }
      
      .floor {
        position: absolute;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, #1a1a1a, #000);
        transform: rotateX(90deg) translateZ(35vh);
        background-image: 
          radial-gradient(circle, rgba(128, 0, 128, 0.2) 1px, transparent 1px),
          radial-gradient(circle, rgba(128, 0, 128, 0.15) 2px, transparent 2px);
        background-size: 30px 30px, 90px 90px;
        box-shadow: 0 0 40px rgba(128, 0, 128, 0.3);
      }
      
      .ceiling {
        position: absolute;
        width: 100%;
        height: 100%;
        background: #000;
        transform: rotateX(-90deg) translateZ(35vh);
      }
      
      .left-wall {
        position: absolute;
        width: 100%;
        height: 100%;
        background: linear-gradient(to right, #000, #1a1a1a);
        transform: rotateY(90deg) translateZ(40vw);
      }
      
      .right-wall {
        position: absolute;
        width: 100%;
        height: 100%;
        background: linear-gradient(to left, #000, #1a1a1a);
        transform: rotateY(-90deg) translateZ(40vw);
      }
      
      .back-wall {
        position: absolute;
        width: 100%;
        height: 100%;
        background: linear-gradient(to top, #000, #1a1a1a);
        transform: translateZ(-50vw);
        display: flex;
        justify-content: center;
        align-items: center;
      }
      
      .doorway {
        width: 200px;
        height: 200px;
        background: rgba(128, 0, 128, 0.2);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 0 50px rgba(128, 0, 128, 0.5);
        animation: glow 2s infinite alternate;
      }
      
      @keyframes glow {
        from {
          box-shadow: 0 0 20px rgba(128, 0, 128, 0.5);
        }
        to {
          box-shadow: 0 0 50px rgba(128, 0, 128, 0.8), 0 0 80px rgba(219, 39, 119, 0.5);
        }
      }
    `}</style>
    </div>
  )
}

// Sample data for featured artists
const featuredArtists = [
  {
    id: "1",
    name: "Neon Dreams",
    bio: "Digital artist specializing in cyberpunk and futuristic cityscapes",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "2",
    name: "Cosmic Voyager",
    bio: "Creating ethereal space-themed digital paintings and animations",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "3",
    name: "Pixel Prophet",
    bio: "Retro-futuristic pixel art with a modern twist",
    image: "/placeholder.svg?height=400&width=600",
  },
]
