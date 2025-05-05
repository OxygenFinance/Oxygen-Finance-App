"use client"

import { AvatarFallback } from "@/components/ui/avatar"

import { AvatarImage } from "@/components/ui/avatar"

import { Avatar } from "@/components/ui/avatar"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallet } from "@/contexts/WalletContext"
import { useAuth } from "@/contexts/AuthContext"
import { fetchFollowCounts, followUser, unfollowUser, isFollowing } from "@/lib/api-client"
import { useComments } from "@/hooks/useStorage"
import { toast } from "react-toastify"

interface Comment {
  id: string
  user_id: string
  username: string
  profile_image?: string
  text: string
  timestamp: string
}

interface Artwork {
  id: string
  title: string
  description?: string
  image?: string
  content_url?: string
  creator_id: string
  price?: string
  likes: number
  created_at: Date
}

export default function CreatorProfilePage() {
  const params = useParams()
  const creatorId = params.id as string
  const { address, connectWallet } = useWallet()
  const { user } = useAuth()
  const [creator, setCreator] = useState<any>(null)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [followers, setFollowers] = useState<any[]>([])
  const [following, setFollowing] = useState<any[]>([])
  const [followCounts, setFollowCounts] = useState({ followers: 0, following: 0 })
  const [isFollowingCreator, setIsFollowingCreator] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const { comments, addComment, updateComment, deleteComment } = useComments(creatorId)
  const [video, setVideo] = useState<Artwork | null>(null) // Initialize video state

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const response = await fetch(`/api/users/${creatorId}`, {
          cache: "no-store",
        })
        if (response.ok) {
          const data = await response.json()
          setCreator(data)
        } else {
          console.error("Failed to fetch creator:", await response.text())
        }
      } catch (error) {
        console.error("Error fetching creator:", error)
      }
    }

    const fetchArtworks = async () => {
      try {
        const response = await fetch(`/api/artworks?creatorId=${creatorId}`, {
          cache: "no-store",
        })
        if (response.ok) {
          const data = await response.json()
          setArtworks(data)
          // Assuming the first artwork is the "video" for comments
          if (data.length > 0) {
            setVideo(data[0])
          }
        } else {
          console.error("Failed to fetch artworks:", await response.text())
        }
      } catch (error) {
        console.error("Error fetching artworks:", error)
      }
    }

    const fetchFollowersData = async () => {
      try {
        const response = await fetch(`/api/follows?userId=${creatorId}&type=followers`, {
          cache: "no-store",
        })
        if (response.ok) {
          const data = await response.json()
          setFollowers(data)
        } else {
          console.error("Failed to fetch followers:", await response.text())
        }
      } catch (error) {
        console.error("Error fetching followers:", error)
      }
    }

    const fetchFollowingData = async () => {
      try {
        const response = await fetch(`/api/follows?userId=${creatorId}&type=following`, {
          cache: "no-store",
        })
        if (response.ok) {
          const data = await response.json()
          setFollowing(data)
        } else {
          console.error("Failed to fetch following:", await response.text())
        }
      } catch (error) {
        console.error("Error fetching following:", error)
      }
    }

    const fetchFollowCountsData = async () => {
      try {
        const counts = await fetchFollowCounts(creatorId)
        setFollowCounts(counts)
      } catch (error) {
        console.error("Error fetching follow counts:", error)
      }
    }

    const checkIfFollowing = async () => {
      if (user?.id && creatorId) {
        try {
          const following = await isFollowing(user.id, creatorId)
          setIsFollowingCreator(following)
        } catch (error) {
          console.error("Error checking if following:", error)
        }
      }
    }

    const loadData = async () => {
      setLoading(true)
      await Promise.all([
        fetchCreator(),
        fetchArtworks(),
        fetchFollowersData(),
        fetchFollowingData(),
        fetchFollowCountsData(),
        checkIfFollowing(),
      ])
      setLoading(false)
    }

    loadData()
  }, [creatorId, user?.id])

  const handleFollow = async () => {
    if (!user?.id) {
      connectWallet()
      return
    }

    try {
      if (isFollowingCreator) {
        await unfollowUser(user.id, creatorId)
        setIsFollowingCreator(false)
        setFollowCounts((prev) => ({ ...prev, followers: Math.max(0, prev.followers - 1) }))
      } else {
        await followUser(user.id, creatorId)
        setIsFollowingCreator(true)
        setFollowCounts((prev) => ({ ...prev, followers: prev.followers + 1 }))
      }
    } catch (error) {
      console.error("Error toggling follow:", error)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error("Please sign in to comment")
      return
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty")
      return
    }

    setIsSubmittingComment(true)

    try {
      if (!video) {
        toast.error("No video selected to comment on.")
        return
      }

      await addComment({
        artwork_id: video.id,
        user_id: user.id,
        username: user.name || `User-${user.id.substring(0, 4)}`,
        profile_image: user.image || undefined,
        text: newComment,
      })

      setNewComment("")
      toast.success("Comment added successfully")
    } catch (error) {
      console.error("Error adding comment:", error)
      toast.error("Failed to add comment")
    } finally {
      setIsSubmittingComment(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-purple-900/20 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-purple-900/20 text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Creator Not Found</h2>
        <p className="mb-6">The creator you're looking for doesn't exist or has been removed.</p>
        <Link href="/creators">
          <Button className="bg-purple-600 hover:bg-purple-700">Back to Creators</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-900/20 text-white">
      {/* Header */}
      <header className="bg-black bg-opacity-50 backdrop-blur-md py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Oxygen Finance
            </h1>
          </Link>
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

      <main className="container mx-auto px-4 py-12">
        {/* Creator Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-purple-500">
            <img
              src={creator.profile_image || `/placeholder.svg?height=400&width=600&seed=${creator.wallet_address}`}
              alt={creator.username || "Creator"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-3xl font-bold">
                {creator.username || `Creator ${creator.wallet_address?.substring(0, 6)}`}
              </h1>
              {user?.id !== creatorId && (
                <Button
                  onClick={handleFollow}
                  variant={isFollowingCreator ? "outline" : "default"}
                  className={
                    isFollowingCreator
                      ? "border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
                      : "bg-purple-600 hover:bg-purple-700"
                  }
                >
                  {isFollowingCreator ? "Following" : "Follow"}
                </Button>
              )}
            </div>
            <p className="text-gray-300 mb-6">
              {creator.bio || "Digital artist and content creator on Oxygen Finance"}
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{artworks.length}</p>
                <p className="text-gray-400">Artworks</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{followCounts.followers}</p>
                <p className="text-gray-400">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{followCounts.following}</p>
                <p className="text-gray-400">Following</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="artworks" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="artworks">Artworks</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>

          <TabsContent value="artworks">
            {artworks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {artworks.map((artwork, index) => (
                  <motion.div key={artwork.id} className="bg-gray-900 rounded-lg overflow-hidden">
                    <Link href={`/video/${artwork.id}`}>
                      <div className="aspect-w-16 aspect-h-9 relative">
                        <img
                          src={artwork.image || "/placeholder.svg?height=400&width=600"}
                          alt={artwork.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1">{artwork.title}</h3>
                      <p className="text-sm text-gray-400">
                        Creator: {artwork.creator_id.slice(0, 6)}...{artwork.creator_id.slice(-4)}
                      </p>
                      <p className="text-sm text-gray-400 mt-2">Price: {artwork.price} MATIC</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <Heart className="mr-2" size={16} />
                          <span>{artwork.likes}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <User size={48} className="mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-semibold mb-2">No Artworks Yet</h3>
                <p className="text-gray-400">This creator hasn't uploaded any artworks yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="followers">
            {followers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {followers.map((follower, index) => (
                  <motion.div key={follower.id} className="bg-gray-900 rounded-lg overflow-hidden">
                    <Link href={`/creator/${follower.id}`}>
                      <div className="p-4 flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage
                            src={
                              follower.profile_image ||
                              `/placeholder.svg?height=40&width=40&seed=${follower.wallet_address}`
                            }
                          />
                          <AvatarFallback>
                            <User />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{follower.username}</h3>
                          <p className="text-sm text-gray-400">
                            {follower.wallet_address.substring(0, 6)}...
                            {follower.wallet_address.substring(follower.wallet_address.length - 4)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-semibold mb-2">No Followers Yet</h3>
                <p className="text-gray-400">This creator doesn't have any followers yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="following">
            {following.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {following.map((followedUser, index) => (
                  <motion.div key={followedUser.id} className="bg-gray-900 rounded-lg overflow-hidden">
                    <Link href={`/creator/${followedUser.id}`}>
                      <div className="p-4 flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage
                            src={
                              followedUser.profile_image ||
                              `/placeholder.svg?height=40&width=40&seed=${followedUser.wallet_address}`
                            }
                          />
                          <AvatarFallback>
                            <User />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{followedUser.username}</h3>
                          <p className="text-sm text-gray-400">
                            {followedUser.wallet_address.substring(0, 6)}...
                            {followedUser.wallet_address.substring(followedUser.wallet_address.length - 4)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-semibold mb-2">Not Following Anyone</h3>
                <p className="text-gray-400">This creator isn't following anyone yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-gray-800 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <img src="/logo.png" alt="Oxygen Finance Logo" className="h-10 mr-3" />
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                  Oxygen Finance
                </h1>
              </div>
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
    </div>
  )
}
