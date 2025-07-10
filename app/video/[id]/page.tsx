"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { VideoPlayer } from "@/components/video-player"
import { Heart, MessageSquare, Share2, User } from "lucide-react"
import { toast } from "react-toastify"

interface Comment {
  id: string
  user_id: string
  username: string
  profile_image?: string
  content: string
  created_at: string
}

interface Video {
  id: string
  title: string
  description: string
  creator: string
  thumbnail: string
  videoSrc: string
  views: string
  likes: number
  comments: number
}

export default function VideoDetailPage() {
  const params = useParams()
  const videoId = params.id as string
  const [video, setVideo] = useState<Video | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  // Sample video data (in real app, fetch from API)
  const sampleVideos = [
    {
      id: "1",
      title: "Web3 Explained: The Future of Internet",
      description:
        "A comprehensive guide to understanding Web3 technology and its implications for the future. This video covers blockchain fundamentals, decentralized applications, and how Web3 will transform the internet as we know it.",
      creator: "Video Creator Pro",
      thumbnail: "/gallery-image1.png",
      videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
      views: "12.5K",
      likes: 892,
      comments: 156,
    },
    {
      id: "2",
      title: "DeFi vs Traditional Banking",
      description:
        "Comparing decentralized finance with traditional banking systems and exploring the advantages and challenges of each approach.",
      creator: "Crypto Filmmaker",
      thumbnail: "/gallery-image2.png",
      videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-water-1164-large.mp4",
      views: "8.3K",
      likes: 654,
      comments: 89,
    },
    {
      id: "3",
      title: "NFT Market Analysis 2024",
      description: "Deep dive into the current NFT market trends and future predictions for digital collectibles.",
      creator: "Tech Reviewer",
      thumbnail: "/gallery-image3.png",
      videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
      views: "15.7K",
      likes: 1203,
      comments: 234,
    },
  ]

  useEffect(() => {
    const fetchVideoDetails = async () => {
      setIsLoading(true)
      try {
        // Find video from sample data
        const foundVideo = sampleVideos.find((v) => v.id === videoId)

        if (foundVideo) {
          setVideo(foundVideo)
          setLikeCount(foundVideo.likes)

          // Load comments from API
          const response = await fetch(`/api/comments?videoId=${videoId}`)
          if (response.ok) {
            const commentsData = await response.json()
            setComments(commentsData)
          }
        }
      } catch (error) {
        console.error("Error fetching video details:", error)
        toast.error("Failed to load video details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideoDetails()
  }, [videoId])

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artwork_id: videoId,
          user_id: 1, // Mock user ID
          content: newComment,
          username: "Demo User",
          profile_image: null,
        }),
      })

      if (response.ok) {
        const newCommentData = await response.json()
        setComments((prev) => [newCommentData, ...prev])
        setNewComment("")
        toast.success("Comment added successfully")
      } else {
        throw new Error("Failed to add comment")
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      toast.error("Failed to add comment")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLike = async () => {
    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artwork_id: videoId,
          user_id: 1, // Mock user ID
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setLiked(result.liked)
        setLikeCount((prev) => (result.liked ? prev + 1 : prev - 1))
        toast.success(result.liked ? "Liked!" : "Unliked!")
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      toast.error("Failed to update like")
    }
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
              <VideoPlayer src={video.videoSrc} poster={video.thumbnail} isLocked={false} />
            </div>

            {/* Video Info */}
            <div className="bg-gray-900 p-6 rounded-lg mb-6">
              <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
              <p className="text-gray-400 mb-4">{video.description}</p>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={`/placeholder.svg?height=40&width=40&seed=${video.creator}`} />
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{video.creator}</p>
                    <p className="text-sm text-gray-400">{video.views} views</p>
                  </div>
                </div>

                <Button className="bg-purple-600 hover:bg-purple-700">Subscribe</Button>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  className={`border-gray-700 ${liked ? "text-red-500 border-red-500" : "text-gray-400"} hover:bg-gray-800`}
                  onClick={handleLike}
                >
                  <Heart className={`mr-2 ${liked ? "fill-current" : ""}`} />
                  {likeCount}
                </Button>

                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-400 hover:bg-gray-800"
                  onClick={() => document.getElementById("comments-section")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <MessageSquare className="mr-2" />
                  {comments.length} Comments
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
              <h2 className="text-xl font-bold mb-4">Comments ({comments.length})</h2>

              {/* Add Comment */}
              <div className="flex items-start space-x-4 mb-6">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40&seed=demo" />
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
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmitComment()
                      }
                    }}
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
                            {new Date(comment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="mt-1">{comment.content}</p>
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
              <div className="flex items-center mb-4">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage src={`/placeholder.svg?height=64&width=64&seed=${video.creator}`} />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-lg">{video.creator}</p>
                  <p className="text-sm text-gray-400">1.2K subscribers</p>
                </div>
              </div>

              <p className="text-gray-300 mb-4">Digital creator specializing in Web3 and blockchain content.</p>

              <Button className="w-full bg-purple-600 hover:bg-purple-700">Subscribe</Button>
            </div>

            {/* Related Videos */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Related Videos</h2>
              <div className="space-y-4">
                {sampleVideos
                  .filter((v) => v.id !== videoId)
                  .slice(0, 3)
                  .map((relatedVideo) => (
                    <Link key={relatedVideo.id} href={`/video/${relatedVideo.id}`}>
                      <div className="flex space-x-3 hover:bg-gray-800 p-2 rounded transition-colors">
                        <img
                          src={relatedVideo.thumbnail || "/placeholder.svg"}
                          alt={relatedVideo.title}
                          className="w-24 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="text-sm font-medium line-clamp-2">{relatedVideo.title}</h3>
                          <p className="text-xs text-gray-400 mt-1">{relatedVideo.creator}</p>
                          <p className="text-xs text-gray-400">{relatedVideo.views} views</p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
