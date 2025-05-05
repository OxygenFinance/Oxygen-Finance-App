"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { VideoPlayer } from "@/components/video-player"
import { useAuth } from "@/contexts/AuthContext"
import { useFollow } from "@/contexts/FollowContext"
import { Heart, MessageSquare, Share2, User } from "lucide-react"
import { toast } from "react-toastify"

interface Comment {
  id: string
  user_id: string
  username: string
  profile_image?: string
  text: string
  timestamp: string
}

export default function VideoDetailPage() {
  const params = useParams()
  const videoId = params.id as string
  const { user } = useAuth()
  const { isFollowing, toggleFollow } = useFollow()
  const [video, setVideo] = useState<any>(null)
  const [creator, setCreator] = useState<any>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFollowingCreator, setIsFollowingCreator] = useState(false)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const fetchVideoDetails = async () => {
      setIsLoading(true)
      try {
        // For demo purposes, we'll get the video from localStorage
        // In a real app, you would fetch this from your API
        const allUsers = JSON.parse(localStorage.getItem("all-creators") || "[]")

        // Get all NFTs from all users
        let allNFTs: any[] = []
        allUsers.forEach((creator: any) => {
          const userNFTs = localStorage.getItem(`${creator.userId}-nfts`)
          if (userNFTs) {
            const nfts = JSON.parse(userNFTs)
            allNFTs = [...allNFTs, ...nfts]
          }
        })

        // Find the video with the matching ID
        const foundVideo = allNFTs.find((nft) => nft.id === videoId)

        if (foundVideo) {
          setVideo(foundVideo)

          // Find the creator
          const foundCreator = allUsers.find(
            (c: any) => c.userId === foundVideo.creatorId || c.address === foundVideo.creator,
          )
          if (foundCreator) {
            setCreator(foundCreator)

            // Check if the current user is following this creator
            if (user?.id) {
              const isFollowing = await isUserFollowing(user.id, foundCreator.userId)
              setIsFollowingCreator(isFollowing)
            }
          }

          // Load comments
          loadComments(foundVideo.id)
        }
      } catch (error) {
        console.error("Error fetching video details:", error)
        toast.error("Failed to load video details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideoDetails()
  }, [videoId, user?.id])

  const isUserFollowing = async (userId: string, creatorId: string) => {
    // In a real app, you would check this from your API
    // For demo, we'll check from localStorage
    const followedCreators = localStorage.getItem(`${userId}-following`) || "[]"
    const following = JSON.parse(followedCreators)
    return following.includes(creatorId)
  }

  const loadComments = (videoId: string) => {
    // In a real app, you would fetch comments from your API
    // For demo, we'll use localStorage
    const savedComments = localStorage.getItem(`comments-${videoId}`) || "[]"
    setComments(JSON.parse(savedComments))
  }

  const handleSubmitComment = async () => {
    if (!user) {
      toast.error("Please sign in to comment")
      return
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty")
      return
    }

    setIsSubmitting(true)

    try {
      // Create a new comment
      const comment: Comment = {
        id: `comment-${Date.now()}`,
        user_id: user.id,
        username: user.name || `User-${user.id.substring(0, 4)}`,
        profile_image: user.image || undefined,
        text: newComment,
        timestamp: new Date().toISOString(),
      }

      // Add to existing comments
      const updatedComments = [...comments, comment]
      setComments(updatedComments)

      // Save to localStorage
      localStorage.setItem(`comments-${videoId}`, JSON.stringify(updatedComments))

      // Clear input
      setNewComment("")
      toast.success("Comment added successfully")
    } catch (error) {
      console.error("Error adding comment:", error)
      toast.error("Failed to add comment")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFollowCreator = async () => {
    if (!user) {
      toast.error("Please sign in to follow creators")
      return
    }

    if (!creator) return

    try {
      // Toggle follow status
      const newStatus = !isFollowingCreator
      setIsFollowingCreator(newStatus)

      // In a real app, you would call your API
      // For demo, we'll use localStorage
      const followingKey = `${user.id}-following`
      const following = JSON.parse(localStorage.getItem(followingKey) || "[]")

      if (newStatus) {
        // Follow
        if (!following.includes(creator.userId)) {
          following.push(creator.userId)
        }
      } else {
        // Unfollow
        const index = following.indexOf(creator.userId)
        if (index > -1) {
          following.splice(index, 1)
        }
      }

      localStorage.setItem(followingKey, JSON.stringify(following))

      toast.success(
        newStatus ? `Following ${creator.username || "creator"}` : `Unfollowed ${creator.username || "creator"}`,
      )
    } catch (error) {
      console.error("Error toggling follow:", error)
      toast.error("Failed to update follow status")
      setIsFollowingCreator(!isFollowingCreator) // Revert UI state
    }
  }

  const handleLike = () => {
    setLiked(!liked)
    // In a real app, you would call your API to update likes
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-purple-900/20 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-purple-900/20 text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Video Not Found</h2>
        <p className="mb-6">The video you're looking for doesn't exist or has been removed.</p>
        <Link href="/gallery">
          <Button className="bg-purple-600 hover:bg-purple-700">Back to Gallery</Button>
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
            <div className="flex items-center">
              <img src="/logo.png" alt="Oxygen Finance Logo" className="h-8 mr-2" />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Oxygen Finance
              </h1>
            </div>
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
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="bg-gray-900 rounded-lg overflow-hidden mb-6">
              <VideoPlayer
                src={
                  video.contentUrl ||
                  video.originalUrl ||
                  "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4"
                }
                poster={video.image}
                isLocked={false}
              />
            </div>

            {/* Video Info */}
            <div className="bg-gray-900 p-6 rounded-lg mb-6">
              <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
              <p className="text-gray-400 mb-4">{video.description}</p>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Link href={`/creator/${creator?.userId || ""}`}>
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage
                          src={creator?.profileImage || `/placeholder.svg?height=40&width=40&seed=${creator?.address}`}
                        />
                        <AvatarFallback>
                          <User />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{creator?.username || video.creator?.substring(0, 8)}</p>
                        <p className="text-sm text-gray-400">{creator?.followers || 0} followers</p>
                      </div>
                    </div>
                  </Link>
                </div>

                <Button
                  onClick={handleFollowCreator}
                  variant={isFollowingCreator ? "outline" : "default"}
                  className={
                    isFollowingCreator
                      ? "border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
                      : "bg-purple-600 hover:bg-purple-700"
                  }
                >
                  {isFollowingCreator ? "Following" : "Follow"}
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  className={`border-gray-700 ${liked ? "text-red-500" : "text-gray-400"} hover:bg-gray-800`}
                  onClick={handleLike}
                >
                  <Heart className={`mr-2 ${liked ? "fill-current" : ""}`} />
                  {liked ? "Liked" : "Like"}
                </Button>

                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-400 hover:bg-gray-800"
                  onClick={() => document.getElementById("comments-section")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <MessageSquare className="mr-2" />
                  Comments
                </Button>

                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-400 hover:bg-gray-800"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    toast.success("Link copied to clipboard")
                  }}
                >
                  <Share2 className="mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Comments Section */}
            <div id="comments-section" className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Comments</h2>

              {/* Add Comment */}
              <div className="flex items-start space-x-4 mb-6">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.image || `/placeholder.svg?height=40&width=40&seed=${user?.id || "guest"}`} />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="bg-gray-800 border-gray-700 mb-2"
                  />
                  <Button
                    onClick={handleSubmitComment}
                    disabled={isSubmitting || !newComment.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isSubmitting ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={comment.profile_image || `/placeholder.svg?height=40&width=40&seed=${comment.user_id}`}
                        />
                        <AvatarFallback>
                          <User />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium">{comment.username}</p>
                          <p className="text-xs text-gray-400 ml-2">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="mt-1">{comment.text}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400">No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Creator Info */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">About Creator</h2>
              <Link href={`/creator/${creator?.userId || ""}`}>
                <div className="flex items-center mb-4">
                  <Avatar className="h-16 w-16 mr-4">
                    <AvatarImage
                      src={creator?.profileImage || `/placeholder.svg?height=64&width=64&seed=${creator?.address}`}
                    />
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-lg">{creator?.username || video.creator?.substring(0, 8)}</p>
                    <p className="text-sm text-gray-400">{creator?.followers || 0} followers</p>
                  </div>
                </div>
              </Link>

              <p className="text-gray-300 mb-4">{creator?.bio || "Digital creator on Oxygen Finance"}</p>

              <Button
                onClick={handleFollowCreator}
                className={
                  isFollowingCreator
                    ? "w-full border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
                    : "w-full bg-purple-600 hover:bg-purple-700"
                }
                variant={isFollowingCreator ? "outline" : "default"}
              >
                {isFollowingCreator ? "Following" : "Follow"}
              </Button>
            </div>

            {/* Related Videos */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">More from this Creator</h2>
              <div className="space-y-4">
                {/* We would fetch related videos here */}
                <p className="text-center text-gray-400">No other videos from this creator yet.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
