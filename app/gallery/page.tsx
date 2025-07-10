"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { ethers } from "ethers"
import { ChevronLeft, ChevronRight, X, Info, Play, Heart, MessageCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/WalletContext"
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from "@/utils/contractConfig"
import { toast } from "react-toastify"
import { Card, CardContent } from "@/components/ui/card"

// Add the bubble video background and enhance animations
export default function GalleryPage() {
  const { address, connectWallet } = useWallet()
  const [activeRoom, setActiveRoom] = useState(0)
  const [viewingArtwork, setViewingArtwork] = useState<Artwork | null>(null)
  const [showInfo, setShowInfo] = useState(false)
  const galleryRef = useRef<HTMLDivElement>(null)
  const [isMinting, setIsMinting] = useState(false)
  const [showBubbleVideo, setShowBubbleVideo] = useState(true)
  const [particlesVisible, setParticlesVisible] = useState(true)
  const controls = useAnimation()
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({})
  const [playingVideos, setPlayingVideos] = useState<{ [key: string]: boolean }>({})
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  // Types
  interface Comment {
    user: string
    text: string
  }

  interface Artwork {
    id: string
    title: string
    artist: string
    description: string
    image: string
    videoSrc: string
    medium: string
    year: number
    price: string
    likes: number
    comments?: Comment[]
    creator?: string
    views?: string
    thumbnail?: string
  }

  interface Room {
    id: string
    name: string
    description: string
    artworks: Artwork[]
  }

  // Update the sample data for gallery rooms to use our new videos
  const rooms: Room[] = [
    {
      id: "digital-video",
      name: "Digital Video Gallery",
      description: "Featuring cutting-edge digital videos from renowned creators",
      artworks: [
        {
          id: "1",
          title: "Neon City Dreams",
          artist: "CyberArtist",
          description:
            "A futuristic cityscape bathed in neon lights, showcasing a vibrant cyberpunk aesthetic with flying vehicles and towering skyscrapers.",
          image: "/gallery-image1.png",
          videoSrc: "/videos/video-1.mp4",
          medium: "Digital Video",
          year: 2023,
          price: "2.5",
          likes: 120,
          comments: [
            { user: "DigitalFan", text: "The lighting effects in this are incredible!" },
            { user: "NeonLover", text: "I can almost feel the rain in this scene. Amazing work!" },
          ],
        },
        {
          id: "2",
          title: "Ethereal Landscape",
          artist: "DreamWeaver",
          description:
            "An otherworldly landscape featuring floating islands and surreal color palettes that challenge perception.",
          image: "/gallery-image2.png",
          videoSrc: "/videos/video-2.mp4",
          medium: "Digital Video",
          year: 2022,
          price: "1.8",
          likes: 95,
          comments: [
            { user: "ArtCollector", text: "The color palette is absolutely mesmerizing." },
            { user: "SurrealFan", text: "This reminds me of a dream I once had. Beautiful!" },
          ],
        },
        {
          id: "3",
          title: "Abstract Emotions",
          artist: "ColorMaster",
          description: "An abstract representation of human emotions through vibrant colors and dynamic shapes.",
          image: "/gallery-image3.png",
          videoSrc: "/videos/video-3.mp4",
          medium: "Digital Video",
          year: 2023,
          price: "3.2",
          likes: 85,
          comments: [{ user: "EmotionalViewer", text: "I can feel the joy and sadness intertwined. Powerful." }],
        },
        {
          id: "4",
          title: "Cosmic Journey",
          artist: "StarGazer",
          description: "A breathtaking view of deep space with nebulae, stars, and cosmic phenomena.",
          image: "/gallery-image4.png",
          videoSrc: "/videos/video-4.mp4",
          medium: "Digital Video",
          year: 2022,
          price: "2.7",
          likes: 150,
          comments: [
            { user: "SpaceEnthusiast", text: "The detail in the nebula is astounding!" },
            { user: "GalaxyQuest", text: "I could stare at this for hours. Truly captivating." },
          ],
        },
        {
          id: "5",
          title: "Digital Flora",
          artist: "NatureTech",
          description: "Hyperrealistic digital plants that blend natural elements with technological components.",
          image: "/gallery-image1.png",
          videoSrc: "/videos/video-5.mp4",
          medium: "3D Video",
          year: 2023,
          price: "4.0",
          likes: 110,
          comments: [],
        },
        {
          id: "6",
          title: "Quantum Dreams",
          artist: "MindScape",
          description: "A surreal visualization of quantum physics concepts through dreamlike imagery.",
          image: "/gallery-image2.png",
          videoSrc: "/videos/video-6.mp4",
          medium: "Digital Video",
          year: 2021,
          price: "2.2",
          likes: 75,
          comments: [],
        },
        {
          id: "7",
          title: "Techno Organism",
          artist: "BioDigital",
          description:
            "A fascinating blend of biological forms and technological elements creating a new form of digital life.",
          image: "/gallery-image3.png",
          videoSrc: "/videos/video-7.mp4",
          medium: "Digital Video",
          year: 2023,
          price: "3.5",
          likes: 130,
          comments: [],
        },
        {
          id: "8",
          title: "Cybernetic Pulse",
          artist: "NeuralArtist",
          description: "A rhythmic visualization of data flowing through neural networks.",
          image: "/gallery-image4.png",
          videoSrc: "/videos/bubble-fish.mp4",
          medium: "Digital Video",
          year: 2023,
          price: "2.9",
          likes: 88,
          comments: [],
        },
        {
          id: "9",
          title: "Virtual Ecosystem",
          artist: "DigitalNaturalist",
          description: "A self-contained digital ecosystem with evolving virtual creatures.",
          image: "/gallery-image1.png",
          videoSrc: "/videos/video-1.mp4",
          medium: "Interactive Video",
          year: 2022,
          price: "5.0",
          likes: 200,
          comments: [],
        },
        {
          id: "10",
          title: "Holographic Memories",
          artist: "RetroFuturist",
          description: "Nostalgic scenes reimagined as futuristic holographic projections.",
          image: "/gallery-image2.png",
          videoSrc: "/videos/video-2.mp4",
          medium: "Digital Video",
          year: 2023,
          price: "3.7",
          likes: 145,
          comments: [],
        },
        {
          id: "11",
          title: "Fractal Dimensions",
          artist: "InfinityCreator",
          description: "Endlessly zooming fractal patterns that reveal new worlds within worlds.",
          image: "/gallery-image3.png",
          videoSrc: "/videos/video-3.mp4",
          medium: "Digital Video",
          year: 2022,
          price: "2.8",
          likes: 170,
          comments: [],
        },
      ],
    },
    {
      id: "comic-video",
      name: "Comic Video Showcase",
      description: "Celebrating the best in digital comic videos and illustration",
      artworks: [
        {
          id: "12",
          title: "Hero's Journey",
          artist: "ComicMaster",
          description:
            "A dynamic comic video showcasing a superhero in mid-flight against a dramatic cityscape backdrop.",
          image: "/gallery-image4.png",
          videoSrc: "/videos/video-4.mp4",
          medium: "Digital Comic Video",
          year: 2023,
          price: "2.8",
          likes: 135,
          comments: [],
        },
        {
          id: "13",
          title: "Villain's Lair",
          artist: "DarkIllustrator",
          description:
            "A detailed video of a supervillain's secret headquarters with intricate machinery and ominous lighting.",
          image: "/gallery-image1.png",
          videoSrc: "/videos/video-5.mp4",
          medium: "Digital Video",
          year: 2022,
          price: "3.0",
          likes: 110,
          comments: [],
        },
        {
          id: "14",
          title: "Epic Battle Scene",
          artist: "ActionArtist",
          description: "A high-energy battle scene between heroes and villains with dynamic poses and special effects.",
          image: "/gallery-image2.png",
          videoSrc: "/videos/video-6.mp4",
          medium: "Digital Comic Video",
          year: 2023,
          price: "2.5",
          likes: 125,
          comments: [],
        },
        {
          id: "15",
          title: "Character Design: Mystic",
          artist: "CharacterPro",
          description: "A detailed character design video for a mystical character with various poses and expressions.",
          image: "/gallery-image3.png",
          videoSrc: "/videos/video-7.mp4",
          medium: "Digital Character Video",
          year: 2022,
          price: "1.9",
          likes: 95,
          comments: [],
        },
        {
          id: "16",
          title: "Comic Cover Video",
          artist: "CoverMaster",
          description: "A striking comic book cover video featuring dramatic composition and eye-catching typography.",
          image: "/gallery-image4.png",
          videoSrc: "/videos/bubble-fish.mp4",
          medium: "Digital Cover Video",
          year: 2023,
          price: "3.5",
          likes: 140,
          comments: [],
        },
        {
          id: "17",
          title: "Manga Style Scene",
          artist: "MangaCreator",
          description: "A beautifully rendered manga-style video with expressive characters and detailed backgrounds.",
          image: "/gallery-image1.png",
          videoSrc: "/videos/video-1.mp4",
          medium: "Digital Manga Video",
          year: 2022,
          price: "2.2",
          likes: 115,
          comments: [],
        },
        {
          id: "18",
          title: "Storyboard Sequence",
          artist: "StoryArtist",
          description: "A professional storyboard sequence showing a dramatic chase scene with dynamic camera angles.",
          image: "/gallery-image2.png",
          videoSrc: "/videos/video-2.mp4",
          medium: "Digital Storyboard",
          year: 2023,
          price: "2.0",
          likes: 85,
          comments: [],
        },
        {
          id: "19",
          title: "Comic Animation",
          artist: "FrameByFrame",
          description: "A short animated sequence bringing comic panels to life with smooth transitions.",
          image: "/gallery-image3.png",
          videoSrc: "/videos/video-3.mp4",
          medium: "Digital Animation",
          year: 2022,
          price: "3.2",
          likes: 130,
          comments: [],
        },
        {
          id: "20",
          title: "Superhero Team-Up",
          artist: "EnsembleMaster",
          description: "An epic group shot of superheroes uniting against a common threat.",
          image: "/gallery-image4.png",
          videoSrc: "/videos/video-4.mp4",
          medium: "Digital Comic Video",
          year: 2023,
          price: "4.0",
          likes: 175,
          comments: [],
        },
        {
          id: "21",
          title: "Origin Story",
          artist: "NarrativeArtist",
          description: "A visual narrative depicting the origin of a new superhero character.",
          image: "/gallery-image1.png",
          videoSrc: "/videos/video-5.mp4",
          medium: "Digital Comic Video",
          year: 2022,
          price: "2.7",
          likes: 120,
          comments: [],
        },
        {
          id: "22",
          title: "Comic World Building",
          artist: "UniverseCreator",
          description: "A detailed exploration of a fictional comic universe with maps and character relationships.",
          image: "/gallery-image2.png",
          videoSrc: "/videos/video-6.mp4",
          medium: "Digital World-Building",
          year: 2023,
          price: "3.8",
          likes: 145,
          comments: [],
        },
      ],
    },
    {
      id: "animated-nft",
      name: "Animated NFT Collection",
      description: "Cutting-edge animated digital collectibles",
      artworks: [
        {
          id: "23",
          title: "Hypnotic Loops",
          artist: "LoopMaster",
          description: "A mesmerizing animated loop with geometric patterns that continuously transform and evolve.",
          image: "/gallery-image3.png",
          videoSrc: "/videos/video-7.mp4",
          medium: "Animated NFT",
          year: 2023,
          price: "4.5",
          likes: 190,
          comments: [],
        },
        {
          id: "24",
          title: "Evolving Creature",
          artist: "DigitalEvolution",
          description: "An animated digital creature that evolves through different forms in a seamless loop.",
          image: "/gallery-image4.png",
          videoSrc: "/videos/bubble-fish.mp4",
          medium: "Animated NFT",
          year: 2022,
          price: "5.0",
          likes: 210,
          comments: [],
        },
        {
          id: "25",
          title: "Particle Symphony",
          artist: "ParticleMaster",
          description:
            "A beautiful dance of particles responding to an invisible force, creating mesmerizing patterns.",
          image: "/gallery-image1.png",
          videoSrc: "/videos/video-1.mp4",
          medium: "Animated NFT",
          year: 2023,
          price: "3.8",
          likes: 165,
          comments: [],
        },
        {
          id: "26",
          title: "Glitch Video Animation",
          artist: "GlitchMaster",
          description: "A stylized animation incorporating digital glitches and artifacts as artistic elements.",
          image: "/gallery-image2.png",
          videoSrc: "/videos/video-2.mp4",
          medium: "Animated NFT",
          year: 2022,
          price: "3.2",
          likes: 140,
          comments: [],
        },
        {
          id: "27",
          title: "Holographic Portrait",
          artist: "HoloArtist",
          description: "A futuristic holographic portrait that shifts and changes based on viewing angle.",
          image: "/gallery-image3.png",
          videoSrc: "/videos/video-3.mp4",
          medium: "Animated NFT",
          year: 2023,
          price: "6.0",
          likes: 230,
          comments: [],
        },
        {
          id: "28",
          title: "Weather System",
          artist: "ElementalArtist",
          description: "An animated miniature weather system with clouds, rain, and lightning in a continuous cycle.",
          image: "/gallery-image4.png",
          videoSrc: "/videos/video-4.mp4",
          medium: "Animated NFT",
          year: 2022,
          price: "4.2",
          likes: 175,
          comments: [],
        },
        {
          id: "29",
          title: "Cybernetic Bloom",
          artist: "TechnoFlorist",
          description: "A digital flower that blooms and transforms with cybernetic elements and glowing effects.",
          image: "/gallery-image1.png",
          videoSrc: "/videos/video-5.mp4",
          medium: "Animated NFT",
          year: 2023,
          price: "5.5",
          likes: 195,
          comments: [],
        },
        {
          id: "30",
          title: "Liquid Metal",
          artist: "MetalMorphosis",
          description: "A mesmerizing animation of liquid metal forming and reforming into different shapes.",
          image: "/gallery-image2.png",
          videoSrc: "/videos/video-6.mp4",
          medium: "Animated NFT",
          year: 2022,
          price: "4.8",
          likes: 185,
          comments: [],
        },
        {
          id: "31",
          title: "Cosmic Dance",
          artist: "GalacticAnimator",
          description: "An animated sequence of celestial bodies performing a choreographed cosmic ballet.",
          image: "/gallery-image3.png",
          videoSrc: "/videos/video-7.mp4",
          medium: "Animated NFT",
          year: 2023,
          price: "5.2",
          likes: 205,
          comments: [],
        },
        {
          id: "32",
          title: "Digital Heartbeat",
          artist: "PulseCreator",
          description: "A rhythmic animation synchronized to a heartbeat with pulsating colors and shapes.",
          image: "/gallery-image4.png",
          videoSrc: "/videos/bubble-fish.mp4",
          medium: "Animated NFT",
          year: 2022,
          price: "3.9",
          likes: 160,
          comments: [],
        },
        {
          id: "33",
          title: "Neon Cascade",
          artist: "LightFlowArtist",
          description: "A flowing cascade of neon lights that create an ever-changing abstract composition.",
          image: "/gallery-image1.png",
          videoSrc: "/videos/video-1.mp4",
          medium: "Animated NFT",
          year: 2023,
          price: "4.7",
          likes: 180,
          comments: [],
        },
      ],
    },
  ]

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewingArtwork) {
        if (e.key === "Escape") {
          setViewingArtwork(null)
        }
        return
      }

      if (e.key === "ArrowLeft") {
        setActiveRoom((prev) => (prev > 0 ? prev - 1 : rooms.length - 1))
      } else if (e.key === "ArrowRight") {
        setActiveRoom((prev) => (prev < rooms.length - 1 ? prev + 1 : 0))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [viewingArtwork, rooms])

  // Add a timeout to hide the bubble video after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubbleVideo(false)
    }, 10000)
    return () => clearTimeout(timer)
  }, [])

  // Animate particles
  useEffect(() => {
    if (particlesVisible) {
      controls.start({
        y: [0, -10, 0],
        transition: {
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        },
      })
    }
  }, [controls, particlesVisible])

  const navigateRoom = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setActiveRoom((prev) => (prev > 0 ? prev - 1 : rooms.length - 1))
    } else {
      setActiveRoom((prev) => (prev < rooms.length - 1 ? prev + 1 : 0))
    }
  }

  const handleArtworkClick = (artwork: Artwork) => {
    setViewingArtwork(artwork)
  }

  const toggleVideoPlay = (id: string) => {
    const video = videoRefs.current[id]
    if (video) {
      if (video.paused) {
        video.play()
        setPlayingVideos((prev) => ({ ...prev, [id]: true }))
      } else {
        video.pause()
        setPlayingVideos((prev) => ({ ...prev, [id]: false }))
      }
    }
  }

  const handleMint = async (artwork: Artwork) => {
    if (!address) {
      connectWallet()
      return
    }

    setIsMinting(true)

    try {
      // In a real app, you would connect to the contract and mint the NFT
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer)

      // Convert price to wei
      const priceInWei = ethers.parseEther(artwork.price)

      // Call the mintNFT function on the contract
      const tx = await contract.mintNFT(
        artwork.image, // Using image URL as metadata URI for demo
        priceInWei,
        10, // 10% royalty
        { value: ethers.parseEther("0.01") }, // Sending 0.01 MATIC as minting fee
      )

      toast.info("Transaction submitted, waiting for confirmation...")

      await tx.wait()

      toast.success(`Successfully minted "${artwork.title}"!`)
    } catch (error: any) {
      console.error("Error minting NFT:", error)
      toast.error(`Failed to mint: ${error.message || "Unknown error"}`)
    } finally {
      setIsMinting(false)
    }
  }

  const sampleVideos = [
    {
      id: "1",
      title: "Web3 Explained: The Future of Internet",
      description: "A comprehensive guide to understanding Web3 technology and its implications for the future.",
      creator: "Video Creator Pro",
      thumbnail: "/gallery-image1.png",
      views: "12.5K",
      likes: 892,
      comments: 156,
    },
    {
      id: "2",
      title: "DeFi vs Traditional Banking",
      description: "Comparing decentralized finance with traditional banking systems.",
      creator: "Crypto Filmmaker",
      thumbnail: "/gallery-image2.png",
      views: "8.3K",
      likes: 654,
      comments: 89,
    },
    {
      id: "3",
      title: "NFT Market Analysis 2024",
      description: "Deep dive into the current NFT market trends and future predictions.",
      creator: "Tech Reviewer",
      thumbnail: "/gallery-image3.png",
      views: "15.7K",
      likes: 1203,
      comments: 234,
    },
    {
      id: "4",
      title: "Smart Contracts Tutorial",
      description: "Learn how to create and deploy smart contracts on Ethereum.",
      creator: "DeFi Educator",
      thumbnail: "/gallery-image4.png",
      views: "9.1K",
      likes: 567,
      comments: 78,
    },
    {
      id: "5",
      title: "Crypto Trading Strategies",
      description: "Professional trading strategies for cryptocurrency markets.",
      creator: "NFT Artist",
      thumbnail: "/gallery-image1.png",
      views: "11.2K",
      likes: 789,
      comments: 145,
    },
    {
      id: "6",
      title: "Blockchain Development Guide",
      description: "Complete guide to becoming a blockchain developer.",
      creator: "Video Creator Pro",
      thumbnail: "/gallery-image2.png",
      views: "13.8K",
      likes: 945,
      comments: 187,
    },
  ]

  return (
    <>
      {/* Header */}
      <header className="bg-black bg-opacity-50 backdrop-blur-md py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center">
              <img src="/logo.png" alt="Oxygen Finance Logo" className="h-8 mr-2" />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Oxygen Finance
              </h1>
            </div>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/gallery" className="text-pink-400 border-b border-pink-400 pb-1">
              Video HUB
            </Link>
            <Link href="/creators" className="hover:text-pink-400 transition-colors">
              Creators
            </Link>
            <Link href="/create" className="hover:text-pink-400 transition-colors">
              Create
            </Link>
            {!address && (
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

      {/* Bubble Video Background */}
      {showBubbleVideo && (
        <div className="fixed inset-0 z-10 pointer-events-none">
          <video src="/bubble-video.mp4" autoPlay muted loop className="w-full h-full object-cover opacity-40"></video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70"></div>
        </div>
      )}

      {/* Floating Particles */}
      {particlesVisible && (
        <div className="fixed inset-0 z-20 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-70"
              style={{
                width: Math.random() * 10 + 2 + "px",
                height: Math.random() * 10 + 2 + "px",
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                filter: "blur(1px)",
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                scale: [1, Math.random() * 0.5 + 0.8, 1],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      )}

      {/* 3D Gallery */}
      {/* <div className="pt-20 h-screen relative z-30" ref={galleryRef}>
        <div className="relative h-full w-full perspective-2000">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRoom}
              className="gallery-room"
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <div className="room-info absolute top-4 left-4 z-10 bg-black bg-opacity-70 backdrop-blur-sm p-3 rounded-lg">
                <h2 className="text-xl font-bold">{rooms[activeRoom].name}</h2>
                <p className="text-gray-400">{rooms[activeRoom].description}</p>
              </div>

              <div className="gallery-walls">
                <div className="wall wall-left">
                  {rooms[activeRoom].artworks.slice(0, 3).map((artwork, index) => (
                    <motion.div
                      key={artwork.id}
                      className="artwork-frame"
                      style={{
                        top: `${15 + index * 30}%`,
                        left: `${Math.random() * 20 + 10}%`,
                      }}
                      onClick={() => handleArtworkClick(artwork)}
                      whileHover={{
                        scale: 1.1,
                        z: 50,
                        boxShadow: "0 0 30px rgba(219, 39, 119, 0.5), 0 0 60px rgba(124, 58, 237, 0.3)",
                        rotateY: 5,
                      }}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        rotateZ: [Math.random() * 2 - 1, Math.random() * -2 + 1, Math.random() * 2 - 1],
                        y: [Math.random() * 10, Math.random() * -10, Math.random() * 10],
                      }}
                      transition={{
                        delay: index * 0.2,
                        duration: 0.5,
                        rotateZ: {
                          duration: Math.random() * 5 + 5,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                        },
                        y: {
                          duration: Math.random() * 5 + 5,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                        },
                      }}
                    >
                      <div className="relative w-full h-full">
                        <video
                          ref={(el) => (videoRefs.current[artwork.id] = el)}
                          src={artwork.videoSrc}
                          className="artwork-image w-full h-full object-cover"
                          loop
                          muted
                          playsInline
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleVideoPlay(artwork.id)
                          }}
                        />
                        <button
                          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleVideoPlay(artwork.id)
                          }}
                        >
                          {playingVideos[artwork.id] ? (
                            <Pause className="w-12 h-12 text-white" />
                          ) : (
                            <Play className="w-12 h-12 text-white" />
                          )}
                        </button>
                      </div>
                      <div className="artwork-info">
                        <h3>{artwork.title}</h3>
                        <p>{artwork.artist}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="wall wall-front">
                  {rooms[activeRoom].artworks.slice(3, 8).map((artwork, index) => (
                    <motion.div
                      key={artwork.id}
                      className="artwork-frame"
                      style={{
                        left: `${15 + index * 17}%`,
                        top: `${Math.random() * 20 + 30}%`,
                      }}
                      onClick={() => handleArtworkClick(artwork)}
                      whileHover={{
                        scale: 1.1,
                        z: 50,
                        boxShadow: "0 0 30px rgba(219, 39, 119, 0.5), 0 0 60px rgba(124, 58, 237, 0.3)",
                        rotateY: 5,
                      }}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        rotateZ: [Math.random() * 2 - 1, Math.random() * -2 + 1, Math.random() * 2 - 1],
                        x: [Math.random() * 10, Math.random() * -10, Math.random() * 10],
                      }}
                      transition={{
                        delay: index * 0.2,
                        duration: 0.5,
                        rotateZ: {
                          duration: Math.random() * 5 + 5,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                        },
                        x: {
                          duration: Math.random() * 5 + 5,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                        },
                      }}
                    >
                      <div className="relative w-full h-full">
                        <video
                          ref={(el) => (videoRefs.current[artwork.id] = el)}
                          src={artwork.videoSrc}
                          className="artwork-image w-full h-full object-cover"
                          loop
                          muted
                          playsInline
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleVideoPlay(artwork.id)
                          }}
                        />
                        <button
                          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleVideoPlay(artwork.id)
                          }}
                        >
                          {playingVideos[artwork.id] ? (
                            <Pause className="w-12 h-12 text-white" />
                          ) : (
                            <Play className="w-12 h-12 text-white" />
                          )}
                        </button>
                      </div>
                      <div className="artwork-info">
                        <h3>{artwork.title}</h3>
                        <p>{artwork.artist}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="wall wall-right">
                  {rooms[activeRoom].artworks.slice(8, 11).map((artwork, index) => (
                    <motion.div
                      key={artwork.id}
                      className="artwork-frame"
                      style={{
                        top: `${15 + index * 30}%`,
                        right: `${Math.random() * 20 + 10}%`,
                      }}
                      onClick={() => handleArtworkClick(artwork)}
                      whileHover={{
                        scale: 1.1,
                        z: 50,
                        boxShadow: "0 0 30px rgba(219, 39, 119, 0.5), 0 0 60px rgba(124, 58, 237, 0.3)",
                        rotateY: -5,
                      }}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        rotateZ: [Math.random() * 2 - 1, Math.random() * -2 + 1, Math.random() * 2 - 1],
                        y: [Math.random() * 10, Math.random() * -10, Math.random() * 10],
                      }}
                      transition={{
                        delay: index * 0.2,
                        duration: 0.5,
                        rotateZ: {
                          duration: Math.random() * 5 + 5,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                        },
                        y: {
                          duration: Math.random() * 5 + 5,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                        },
                      }}
                    >
                      <div className="relative w-full h-full">
                        <video
                          ref={(el) => (videoRefs.current[artwork.id] = el)}
                          src={artwork.videoSrc}
                          className="artwork-image w-full h-full object-cover"
                          loop
                          muted
                          playsInline
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleVideoPlay(artwork.id)
                          }}
                        />
                        <button
                          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleVideoPlay(artwork.id)
                          }}
                        >
                          {playingVideos[artwork.id] ? (
                            <Pause className="w-12 h-12 text-white" />
                          ) : (
                            <Play className="w-12 h-12 text-white" />
                          )}
                        </button>
                      </div>
                      <div className="artwork-info">
                        <h3>{artwork.title}</h3>
                        <p>{artwork.artist}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="floor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  {/* Reflective floor with grid */}
                  <div className="floor-grid"></div>
                </motion.div>

                <motion.div
  \
                  className="ceiling"
                  initial=
  opacity: 0
  \
                  animate=
  opacity: 1
  \
                  transition=
  duration: 1,
  \
                >
  Array.from({ length: 5 }).map((_, i) => (
    <motion.div
      key={i}
      className="ceiling-light"
      style={{
        left: `${10 + i * 20}%`,
      }}
      animate={{
        opacity: [0.4, 0.8, 0.4],
        boxShadow: [
          "0 0 20px rgba(219, 39, 119, 0.3), 0 0 40px rgba(124, 58, 237, 0.2)",
          "0 0 40px rgba(219, 39, 119, 0.5), 0 0 80px rgba(124, 58, 237, 0.3)",
          "0 0 20px rgba(219, 39, 119, 0.3), 0 0 40px rgba(124, 58, 237, 0.2)",
        ],
      }}
      transition={{
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        delay: i * 0.5,
      }}
    />
  ))
  </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
  ;<div className="absolute bottom-8 left-0 right-0 flex justify-center items-center z-10 space-x-4">
    <Button
      variant="outline"
      className="border-white/30 bg-black/50 backdrop-blur-sm hover:bg-white/20"
      onClick={() => navigateRoom("prev")}
    >
      <ChevronLeft />
      Previous Room
    </Button>

    <div className="flex space-x-2">
      {rooms.map((_, index) => (
        <motion.button
          key={index}
          className={`w-3 h-3 rounded-full ${index === activeRoom ? "bg-pink-500" : "bg-white/30"}`}
          onClick={() => setActiveRoom(index)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          animate={
            index === activeRoom
              ? {
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    "0 0 0px rgba(219, 39, 119, 0.5)",
                    "0 0 10px rgba(219, 39, 119, 0.8)",
                    "0 0 0px rgba(219, 39, 119, 0.5)",
                  ],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
      ))}
    </div>

    <Button
      variant="outline"
      className="border-white/30 bg-black/50 backdrop-blur-sm hover:bg-white/20"
      onClick={() => navigateRoom("next")}
    >
      Next Room
      <ChevronRight />
    </Button>
  </div>
  </div>
      </div> */
}
;<div className="min-h-screen bg-black text-white py-20">
  <div className="container mx-auto px-4">
    <motion.div
      className="text-center mb-12"
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
      }}
    >
      <h1 className="text-5xl font-bold mb-4">
        Video <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">HUB</span>
      </h1>
      <p className="text-xl text-gray-300 max-w-2xl mx-auto">
        Discover amazing video content from talented creators around the world
      </p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {sampleVideos.map((video, index) => (
        <motion.div
          key={video.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all duration-300">
            <CardContent className="p-0">
              <div className="relative group">
                <img
                  src={video.thumbnail || "/placeholder.svg?height=200&width=350"}
                  alt={video.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-t-lg">
                  <Button
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => setSelectedVideo(video.id)}
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Play Video
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                <p className="text-gray-400 mb-4 line-clamp-2">{video.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>By {video.creator}</span>
                  <span>{video.views} views</span>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-red-500 transition-colors">
                      <Heart className="h-4 w-4" />
                      <span>{video.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-500 transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span>{video.comments}</span>
                    </button>
                  </div>
                  <button className="text-gray-400 hover:text-purple-500 transition-colors">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
</div>

{
  /* Artwork Viewer Modal */
}
;<AnimatePresence>
  {viewingArtwork && (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row">
        <motion.div
          className="flex-1 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <video src={viewingArtwork.videoSrc} controls autoPlay className="w-full h-full object-contain rounded-lg" />
        </motion.div>

        <AnimatePresence>
          {showInfo && (
            <motion.div
              className="w-full md:w-96 bg-gray-900 p-6 rounded-lg md:ml-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <h2 className="text-2xl font-bold mb-2">{viewingArtwork.title}</h2>
              <p className="text-gray-400 mb-4">By {viewingArtwork.artist}</p>
              <p className="mb-4">{viewingArtwork.description}</p>

              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-400">Medium</div>
                  <div>{viewingArtwork.medium}</div>
                  <div className="text-gray-400">Year</div>
                  <div>{viewingArtwork.year}</div>
                  <div className="text-gray-400">Price</div>
                  <div>{viewingArtwork.price} MATIC</div>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 mb-4"
                onClick={() => handleMint(viewingArtwork)}
                disabled={isMinting}
              >
                {isMinting ? "Minting..." : "Mint This Video"}
              </Button>

              {/* Comments Section */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Comments</h3>
                <div className="space-y-3 max-h-40 overflow-y-auto mb-4">
                  {viewingArtwork.comments?.map((comment, index) => (
                    <div key={index} className="bg-gray-800 p-2 rounded">
                      <div className="flex items-center mb-1">
                        <div className="w-6 h-6 rounded-full bg-purple-500 mr-2"></div>
                        <p className="text-sm font-medium">{comment.user}</p>
                      </div>
                      <p className="text-sm text-gray-300">{comment.text}</p>
                    </div>
                  )) || <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>}
                </div>

                <div className="flex">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <Button className="rounded-l-none bg-purple-500 hover:bg-purple-600">Post</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-colors"
          onClick={() => setViewingArtwork(null)}
        >
          <X />
        </button>

        <button
          className="absolute bottom-4 right-4 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-colors"
          onClick={() => setShowInfo(!showInfo)}
        >
          <Info />
        </button>
      </div>
    </motion.div>
  )}
</AnimatePresence>

{
  /* Enhanced CSS for 3D effects */
}
;<style jsx>{`
        .perspective-2000 {
          perspective: 2000px;
        }
        
        .gallery-room {
          position: absolute;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }
        
        .gallery-walls {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }
        
        .wall {
          position: absolute;
          background-color: rgba(17, 17, 17, 0.5);
          background-image: linear-gradient(rgba(128, 0, 128, 0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(128, 0, 128, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          backdrop-filter: blur(5px);
        }
        
        .wall-left {
          width: 100vh;
          height: 100%;
          left: 50%;
          transform: translateX(-50%) rotateY(90deg) translateZ(50vh);
        }
        
        .wall-front {
          width: 100%;
          height: 100%;
          transform: translateZ(-50vh);
        }
        
        .wall-right {
          width: 100vh;
          height: 100%;
          left: 50%;
          transform: translateX(-50%) rotateY(-90deg) translateZ(50vh);
        }
        
        .floor {
          position: absolute;
          width: 100%;
          height: 100vh;
          background: linear-gradient(to bottom, rgba(26, 26, 26, 0.7), rgba(0, 0, 0, 0.9));
          transform: rotateX(90deg) translateZ(50vh);
          box-shadow: 0 0 40px rgba(128, 0, 128, 0.3);
          animation: floorGlow 4s infinite alternate;
          overflow: hidden;
        }
        
        .floor-grid {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(rgba(219, 39, 119, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(219, 39, 119, 0.2) 1px, transparent 1px);
          background-size: 50px 50px;
          transform: perspective(500px) rotateX(60deg);
          animation: gridMove 20s linear infinite;
        }
        
        @keyframes gridMove {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 50px 50px;
          }
        }
        
        @keyframes floorGlow {
          0% {
            box-shadow: 0 0 40px rgba(128, 0, 128, 0.3);
          }
          100% {
            box-shadow: 0 0 60px rgba(128, 0, 128, 0.5), 0 0 100px rgba(219, 39, 119, 0.3);
          }
        }
        
        .ceiling {
          position: absolute;
          width: 100%;
          height: 100vh;
          background: #000;
          transform: rotateX(-90deg) translateZ(50vh);
        }
        
        .ceiling-light {
          position: absolute;
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          box-shadow: 0 0 20px rgba(219, 39, 119, 0.5), 0 0 40px rgba(124, 58, 237, 0.3);
        }
        
        .artwork-frame {
          position: absolute;
          width: 15vw;
          height: 22vh;
          background: #222;
          border: 5px solid #333;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
          transform: translateZ(10px);
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          overflow: hidden;
          border-radius: 5px;
        }
        
        .artwork-frame:hover {
          z-index: 10;
        }
        
        .artwork-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .artwork-frame:hover .artwork-image {
          transform: scale(1.1);
        }
        
        .artwork-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          padding: 8px;
          transform: translateY(100%);
          transition: transform 0.3s ease;
        }
        
        .artwork-frame:hover .artwork-info {
          transform: translateY(0);
        }
        
        .artwork-info h3 {
          font-size: 0.9rem;
          font-weight: bold;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .artwork-info p {
          font-size: 0.7rem;
          color: #ccc;
          margin: 0;
        }
      `}</style>
</>
  )
}
