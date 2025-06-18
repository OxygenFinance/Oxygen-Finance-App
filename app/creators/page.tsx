"use client"

import { motion } from "framer-motion"
import { Users, Video, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Creators() {
  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold mb-4">
            Video{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Creators</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Meet the talented creators behind our amazing video content
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleCreators.map((creator, index) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-6">
                    <img
                      src={creator.avatar || "/placeholder.svg?height=120&width=120"}
                      alt={creator.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-purple-500"
                    />
                  </div>

                  <h3 className="text-xl font-semibold mb-2">{creator.name}</h3>
                  <p className="text-gray-400 mb-4">{creator.bio}</p>

                  <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        <Video className="h-4 w-4 text-purple-500" />
                      </div>
                      <div className="text-lg font-semibold">{creator.videos}</div>
                      <div className="text-xs text-gray-500">Videos</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        <Users className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="text-lg font-semibold">{creator.followers}</div>
                      <div className="text-xs text-gray-500">Followers</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        <Heart className="h-4 w-4 text-red-500" />
                      </div>
                      <div className="text-lg font-semibold">{creator.likes}</div>
                      <div className="text-xs text-gray-500">Likes</div>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Sample creator data
const sampleCreators = [
  {
    id: "1",
    name: "Video Creator Pro",
    bio: "Professional video content creator specializing in Web3 and blockchain content.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=VideoCreator",
    videos: 24,
    followers: "12.5K",
    likes: "89.2K",
  },
  {
    id: "2",
    name: "Crypto Filmmaker",
    bio: "Documentary filmmaker exploring the world of cryptocurrency and NFTs.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoFilms",
    videos: 18,
    followers: "8.3K",
    likes: "65.7K",
  },
  {
    id: "3",
    name: "Tech Reviewer",
    bio: "Technology reviewer focusing on blockchain and Web3 innovations.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TechReview",
    videos: 32,
    followers: "15.7K",
    likes: "124.3K",
  },
  {
    id: "4",
    name: "DeFi Educator",
    bio: "Educational content creator teaching DeFi concepts through engaging videos.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DeFiTeacher",
    videos: 28,
    followers: "9.1K",
    likes: "78.9K",
  },
  {
    id: "5",
    name: "NFT Artist",
    bio: "Digital artist creating NFT collections and sharing the creative process.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NFTArtist",
    videos: 21,
    followers: "11.2K",
    likes: "95.6K",
  },
  {
    id: "6",
    name: "Blockchain Dev",
    bio: "Blockchain developer creating educational content about smart contracts.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=BlockchainDev",
    videos: 35,
    followers: "13.8K",
    likes: "108.4K",
  },
]
