import { sql } from "@/lib/db"
import { signIn } from "next-auth/react"

// API namespace for all client-side API functions
export const api = {
  // User functions
  getUserById: async (id: number): Promise<any | null> => {
    try {
      const result = await sql`
        SELECT * FROM users 
        WHERE id = ${id}
      `
      return result[0] || null
    } catch (error) {
      console.error("Error getting user by ID:", error)
      return null
    }
  },

  getUserByWalletAddress: async (walletAddress: string): Promise<any | null> => {
    try {
      const result = await sql`
        SELECT * FROM users 
        WHERE wallet_address = ${walletAddress}
      `
      return result[0] || null
    } catch (error) {
      console.error("Error getting user by wallet address:", error)
      return null
    }
  },

  createUser: async (userData: any): Promise<any | null> => {
    try {
      const result = await sql`
        INSERT INTO users (
          email, name, username, bio, avatar_url, twitter_id, wallet_address
        ) VALUES (
          ${userData.email || null}, 
          ${userData.name || null}, 
          ${userData.username || null}, 
          ${userData.bio || null},
          ${userData.avatar_url || null},
          ${userData.twitter_id || null},
          ${userData.wallet_address || null}
        )
        RETURNING *
      `
      return result[0]
    } catch (error) {
      console.error("Error creating user:", error)
      return null
    }
  },

  updateUser: async (id: number, userData: any): Promise<any | null> => {
    try {
      const result = await sql`
        UPDATE users
        SET 
          email = COALESCE(${userData.email}, email),
          name = COALESCE(${userData.name}, name),
          username = COALESCE(${userData.username}, username),
          bio = COALESCE(${userData.bio}, bio),
          avatar_url = COALESCE(${userData.avatar_url}, avatar_url),
          twitter_id = COALESCE(${userData.twitter_id}, twitter_id),
          wallet_address = COALESCE(${userData.wallet_address}, wallet_address)
        WHERE id = ${id}
        RETURNING *
      `
      return result[0]
    } catch (error) {
      console.error("Error updating user:", error)
      return null
    }
  },

  // Artwork functions
  getArtworkById: async (id: number): Promise<any | null> => {
    try {
      const result = await sql`
        SELECT * FROM artworks 
        WHERE id = ${id}
      `
      return result[0] || null
    } catch (error) {
      console.error("Error getting artwork by ID:", error)
      return null
    }
  },

  getArtworksByCreator: async (creatorId: number): Promise<any[]> => {
    try {
      return await sql`
        SELECT * FROM artworks 
        WHERE creator_id = ${creatorId}
        ORDER BY created_at DESC
      `
    } catch (error) {
      console.error("Error getting artworks by creator:", error)
      return []
    }
  },

  getAllArtworks: async (limit = 50, offset = 0): Promise<any[]> => {
    try {
      return await sql`
        SELECT * FROM artworks 
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    } catch (error) {
      console.error("Error getting all artworks:", error)
      return []
    }
  },

  createArtwork: async (artworkData: any): Promise<any | null> => {
    try {
      if (!artworkData.title || !artworkData.media_url || !artworkData.creator_id) {
        throw new Error("Missing required fields for artwork creation")
      }

      const result = await sql`
        INSERT INTO artworks (
          title, description, media_url, thumbnail_url, creator_id, token_id, contract_address
        ) VALUES (
          ${artworkData.title}, 
          ${artworkData.description || null}, 
          ${artworkData.media_url}, 
          ${artworkData.thumbnail_url || null}, 
          ${artworkData.creator_id}, 
          ${artworkData.token_id || null},
          ${artworkData.contract_address || null}
        )
        RETURNING *
      `
      return result[0]
    } catch (error) {
      console.error("Error creating artwork:", error)
      return null
    }
  },

  // Comment functions
  getCommentsByArtwork: async (artworkId: number): Promise<any[]> => {
    try {
      return await sql`
        SELECT c.*, u.name, u.username, u.avatar_url
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.artwork_id = ${artworkId}
        ORDER BY c.created_at DESC
      `
    } catch (error) {
      console.error("Error getting comments by artwork:", error)
      return []
    }
  },

  createComment: async (commentData: {
    artwork_id: number
    user_id: number
    content: string
  }): Promise<any | null> => {
    try {
      const result = await sql`
        INSERT INTO comments (
          artwork_id, user_id, content
        ) VALUES (
          ${commentData.artwork_id},
          ${commentData.user_id},
          ${commentData.content}
        )
        RETURNING *
      `
      return result[0]
    } catch (error) {
      console.error("Error creating comment:", error)
      return null
    }
  },

  updateComment: async (id: number, content: string): Promise<any | null> => {
    try {
      const result = await sql`
        UPDATE comments
        SET content = ${content}
        WHERE id = ${id}
        RETURNING *
      `
      return result[0]
    } catch (error) {
      console.error("Error updating comment:", error)
      return null
    }
  },

  deleteComment: async (id: number): Promise<boolean> => {
    try {
      const result = await sql`
        DELETE FROM comments
        WHERE id = ${id}
      `
      return result.count > 0
    } catch (error) {
      console.error("Error deleting comment:", error)
      return false
    }
  },

  // Follow functions
  isFollowing: async (followerId: number, followingId: number): Promise<boolean> => {
    try {
      const result = await sql`
        SELECT * FROM follows
        WHERE follower_id = ${followerId} AND following_id = ${followingId}
      `
      return result.length > 0
    } catch (error) {
      console.error("Error checking if following:", error)
      return false
    }
  },

  followUser: async (followerId: number, followingId: number): Promise<boolean> => {
    try {
      await sql`
        INSERT INTO follows (follower_id, following_id)
        VALUES (${followerId}, ${followingId})
        ON CONFLICT (follower_id, following_id) DO NOTHING
      `
      return true
    } catch (error) {
      console.error("Error following user:", error)
      return false
    }
  },

  unfollowUser: async (followerId: number, followingId: number): Promise<boolean> => {
    try {
      await sql`
        DELETE FROM follows
        WHERE follower_id = ${followerId} AND following_id = ${followingId}
      `
      return true
    } catch (error) {
      console.error("Error unfollowing user:", error)
      return false
    }
  },

  getFollowers: async (userId: number): Promise<any[]> => {
    try {
      return await sql`
        SELECT u.* FROM follows f
        JOIN users u ON f.follower_id = u.id
        WHERE f.following_id = ${userId}
        ORDER BY f.created_at DESC
      `
    } catch (error) {
      console.error("Error getting followers:", error)
      return []
    }
  },

  getFollowing: async (userId: number): Promise<any[]> => {
    try {
      return await sql`
        SELECT u.* FROM follows f
        JOIN users u ON f.following_id = u.id
        WHERE f.follower_id = ${userId}
        ORDER BY f.created_at DESC
      `
    } catch (error) {
      console.error("Error getting following:", error)
      return []
    }
  },

  getFollowCounts: async (userId: number): Promise<{ followers: number; following: number }> => {
    try {
      const followers = await sql`
        SELECT COUNT(*) as count FROM follows
        WHERE following_id = ${userId}
      `

      const following = await sql`
        SELECT COUNT(*) as count FROM follows
        WHERE follower_id = ${userId}
      `

      return {
        followers: Number.parseInt(followers[0].count),
        following: Number.parseInt(following[0].count),
      }
    } catch (error) {
      console.error("Error getting follow counts:", error)
      return { followers: 0, following: 0 }
    }
  },
}

// Export individual functions directly
export const getUserById = api.getUserById
export const getUserByWalletAddress = api.getUserByWalletAddress
export const createUser = api.createUser
export const updateUser = api.updateUser
export const getArtworkById = api.getArtworkById
export const getArtworksByCreator = api.getArtworksByCreator
export const getAllArtworks = api.getAllArtworks
export const createArtwork = api.createArtwork
export const getCommentsByArtwork = api.getCommentsByArtwork
export const createComment = api.createComment
export const updateComment = api.updateComment
export const deleteComment = api.deleteComment
export const hasUserLikedArtwork = api.hasUserLikedArtwork
export const getLikesByArtwork = api.getLikesByArtwork
export const likeArtwork = api.likeArtwork
export const unlikeArtwork = api.unlikeArtwork
export const isFollowing = api.isFollowing
export const followUser = api.followUser
export const unfollowUser = api.unfollowUser
export const getFollowers = api.getFollowers
export const getFollowing = api.getFollowing
export const getFollowCounts = api.getFollowCounts

export async function getUserByTwitter(twitter: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/twitter/${twitter}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch user by Twitter: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching user by Twitter:", error)
    return null
  }
}

export async function connectTwitter(): Promise<void> {
  try {
    await signIn("twitter", { callbackUrl: "/profile" })
  } catch (error) {
    console.error("Error connecting Twitter:", error)
    throw error
  }
}

export type User = {
  id: number
  email?: string
  name?: string
  username?: string
  bio?: string
  avatar_url?: string
  twitter_id?: string
  wallet_address?: string
  created_at: Date
}

export type Comment = {
  id: number
  artwork_id: number
  user_id: number
  content: string
  created_at: Date
}

export type Artwork = {
  id: number
  title: string
  description?: string
  media_url: string
  thumbnail_url?: string
  creator_id: number
  token_id?: string
  contract_address?: string
  created_at: Date
}

export type Follow = {
  id: number
  follower_id: number
  following_id: number
  created_at: Date
}

export type Like = {
  id: number
  user_id: number
  artwork_id: number
  created_at: Date
}

export type Wallet = {
  id: number
  user_id: number
  address: string
  encrypted_private_key?: string
  created_at: Date
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT * FROM users 
      WHERE email = ${email}
    `
    return result[0] || null
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}
