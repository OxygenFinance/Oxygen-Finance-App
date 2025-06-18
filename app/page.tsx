"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
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

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
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
            Video{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">HUB</span>
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Step into our virtual Video HUB showcasing the finest video content from creators around the world
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
              Enter Video HUB <ArrowRight className="ml-2" />
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
                      Enter Video HUB
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Featured Creators Section */}
      <section className="py-20 bg-gradient-to-b from-black to-purple-900/20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Featured Video Creators</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCreators.map((creator, index) => (
              <motion.div
                key={creator.id}
                className="bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={creator.image || "/placeholder.svg?height=256&width=400"}
                    alt={creator.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{creator.name}</h3>
                  <p className="text-gray-400 mb-4">{creator.bio}</p>
                  <Link href={`/creator/${creator.id}`}>
                    <Button
                      variant="outline"
                      className="w-full border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
                    >
                      View Videos
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/creators">
              <Button variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white">
                View All Creators
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Custom CSS for 3D effects */}
      <style jsx global>{`
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

// Sample data for featured video creators
const featuredCreators = [
  {
    id: "1",
    name: "Neon Dreams",
    bio: "Digital video creator specializing in cyberpunk and futuristic cityscapes",
    image: "/gallery-image1.png",
  },
  {
    id: "2",
    name: "Cosmic Voyager",
    bio: "Creating ethereal space-themed digital videos and animations",
    image: "/gallery-image2.png",
  },
  {
    id: "3",
    name: "Pixel Prophet",
    bio: "Retro-futuristic pixel videos with a modern twist",
    image: "/gallery-image3.png",
  },
]
