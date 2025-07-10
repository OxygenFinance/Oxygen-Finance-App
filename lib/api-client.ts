// Simple API client functions without database dependencies

export interface User {
  id: number
  name?: string
  username?: string
  email?: string
  bio?: string
  avatar_url?: string
  twitter_id?: string
  wallet_address?: string
  created_at: string
}

export interface Video {
  id: number
  title: string
  description?: string
  media_url: string
  thumbnail_url?: string
  creator_id: number
  token_id?: string
  contract_address?: string
  created_at: string
}

export interface Comment {
  id: number
  video_id: number
  user_id: number
  content: string
  created_at: string
}

// API functions
export async function getUserById(id: number): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${id}`)
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export async function getVideoById(id: number): Promise<Video | null> {
  try {
    const response = await fetch(`/api/videos/${id}`)
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    console.error("Error fetching video:", error)
    return null
  }
}

export async function getAllVideos(): Promise<Video[]> {
  try {
    const response = await fetch("/api/videos")
    if (!response.ok) return []
    return await response.json()
  } catch (error) {
    console.error("Error fetching videos:", error)
    return []
  }
}

export async function getVideosByCreator(creatorId: number): Promise<Video[]> {
  try {
    const response = await fetch(`/api/videos?creatorId=${creatorId}`)
    if (!response.ok) return []
    return await response.json()
  } catch (error) {
    console.error("Error fetching videos by creator:", error)
    return []
  }
}

export async function createVideo(videoData: Partial<Video>): Promise<Video | null> {
  try {
    const response = await fetch("/api/videos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(videoData),
    })
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    console.error("Error creating video:", error)
    return null
  }
}

export async function createUser(userData: Partial<User>): Promise<User | null> {
  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

export async function getUserByWalletAddress(walletAddress: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users?walletAddress=${walletAddress}`)
    if (!response.ok) return null
    const users = await response.json()
    return users.find((user: User) => user.wallet_address === walletAddress) || null
  } catch (error) {
    console.error("Error fetching user by wallet address:", error)
    return null
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users?email=${email}`)
    if (!response.ok) return null
    const users = await response.json()
    return users.find((user: User) => user.email === email) || null
  } catch (error) {
    console.error("Error fetching user by email:", error)
    return null
  }
}

export async function getUserByTwitter(twitter: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/twitter/${twitter}`)
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    console.error("Error fetching user by Twitter:", error)
    return null
  }
}

export async function updateUser(id: number, userData: Partial<User>): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    console.error("Error updating user:", error)
    return null
  }
}

export async function getCommentsByVideo(videoId: number): Promise<Comment[]> {
  try {
    const response = await fetch(`/api/comments?videoId=${videoId}`)
    if (!response.ok) return []
    return await response.json()
  } catch (error) {
    console.error("Error fetching comments:", error)
    return []
  }
}

export async function createComment(commentData: {
  video_id: number
  user_id: number
  content: string
}): Promise<Comment | null> {
  try {
    const response = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentData),
    })
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    console.error("Error creating comment:", error)
    return null
  }
}

export async function updateComment(id: number, content: string): Promise<Comment | null> {
  try {
    const response = await fetch(`/api/comments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    })
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    console.error("Error updating comment:", error)
    return null
  }
}

export async function deleteComment(id: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/comments/${id}`, {
      method: "DELETE",
    })
    return response.ok
  } catch (error) {
    console.error("Error deleting comment:", error)
    return false
  }
}

export async function isFollowing(followerId: number, followingId: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/follows/check?followerId=${followerId}&followingId=${followingId}`)
    if (!response.ok) return false
    const result = await response.json()
    return result.isFollowing || false
  } catch (error) {
    console.error("Error checking follow status:", error)
    return false
  }
}

export async function followUser(followerId: number, followingId: number): Promise<boolean> {
  try {
    const response = await fetch("/api/follows", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ followerId, followingId }),
    })
    return response.ok
  } catch (error) {
    console.error("Error following user:", error)
    return false
  }
}

export async function unfollowUser(followerId: number, followingId: number): Promise<boolean> {
  try {
    const response = await fetch("/api/follows", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ followerId, followingId }),
    })
    return response.ok
  } catch (error) {
    console.error("Error unfollowing user:", error)
    return false
  }
}

export async function getFollowers(userId: number): Promise<User[]> {
  try {
    const response = await fetch(`/api/follows?type=followers&userId=${userId}`)
    if (!response.ok) return []
    return await response.json()
  } catch (error) {
    console.error("Error fetching followers:", error)
    return []
  }
}

export async function getFollowing(userId: number): Promise<User[]> {
  try {
    const response = await fetch(`/api/follows?type=following&userId=${userId}`)
    if (!response.ok) return []
    return await response.json()
  } catch (error) {
    console.error("Error fetching following:", error)
    return []
  }
}

export async function getFollowCounts(userId: number): Promise<{ followers: number; following: number }> {
  try {
    const response = await fetch(`/api/follows?type=counts&userId=${userId}`)
    if (!response.ok) return { followers: 0, following: 0 }
    return await response.json()
  } catch (error) {
    console.error("Error fetching follow counts:", error)
    return { followers: 0, following: 0 }
  }
}

// Legacy exports for backward compatibility
export const getArtworkById = getVideoById
export const getArtworksByCreator = getVideosByCreator
export const getAllArtworks = getAllVideos
export const createArtwork = createVideo
export const getCommentsByArtwork = getCommentsByVideo
export const hasUserLikedArtwork = () => Promise.resolve(false)
export const getLikesByArtwork = () => Promise.resolve(0)
export const likeArtwork = () => Promise.resolve(true)
export const unlikeArtwork = () => Promise.resolve(true)

// Export for backward compatibility
export const api = {
  getUserById,
  getUserByWalletAddress,
  getUserByEmail,
  getUserByTwitter,
  createUser,
  updateUser,
  getVideoById,
  getAllVideos,
  getVideosByCreator,
  createVideo,
  getCommentsByVideo,
  createComment,
  updateComment,
  deleteComment,
  isFollowing,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getFollowCounts,
  // Legacy aliases
  getArtworkById: getVideoById,
  getArtworksByCreator: getVideosByCreator,
  getAllArtworks: getAllVideos,
  createArtwork: createVideo,
  getCommentsByArtwork: getCommentsByVideo,
  hasUserLikedArtwork: () => Promise.resolve(false),
  getLikesByArtwork: () => Promise.resolve(0),
  likeArtwork: () => Promise.resolve(true),
  unlikeArtwork: () => Promise.resolve(true),
}

export async function connectTwitter(): Promise<void> {
  try {
    // This would integrate with your auth system
    window.location.href = "/api/auth/signin/twitter"
  } catch (error) {
    console.error("Error connecting Twitter:", error)
    throw error
  }
}
