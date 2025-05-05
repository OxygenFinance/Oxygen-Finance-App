import { neon } from "@neondatabase/serverless"

// Use the provided DATABASE_URL or fallback to the hardcoded connection string if not available
const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://OXG_owner:npg_59dxGQDWPvzp@ep-tiny-rain-a5uriang-pooler.us-east-2.aws.neon.tech/OXG?sslmode=require"

// Initialize the SQL client with the connection string
export const sql = neon(connectionString)

console.log("Database connection initialized with:", connectionString.substring(0, 25) + "...")

// Types
export interface Comment {
  id: number
  artwork_id: number
  user_id: number
  content: string
  created_at: Date
}

export interface User {
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

export interface Artwork {
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

export interface Like {
  id: number
  artwork_id: number
  user_id: number
  created_at: Date
}

export interface Follow {
  id: number
  follower_id: number
  following_id: number
  created_at: Date
}

export interface Wallet {
  id: number
  user_id: number
  address: string
  encrypted_private_key?: string
  created_at: Date
}

// User functions
export async function getUserById(id: number): Promise<User | null> {
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

export async function getUserByWalletAddress(walletAddress: string): Promise<User | null> {
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
}

export async function getUserByTwitterId(twitterId: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT * FROM users 
      WHERE twitter_id = ${twitterId}
    `
    return result[0] || null
  } catch (error) {
    console.error("Error getting user by Twitter ID:", error)
    return null
  }
}

export async function createUser(userData: Partial<User>): Promise<User | null> {
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
}

export async function updateUser(id: number, userData: Partial<User>): Promise<User | null> {
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
}

// Artwork functions
export async function getArtworkById(id: number): Promise<Artwork | null> {
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
}

export async function getArtworksByCreator(creatorId: number): Promise<Artwork[]> {
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
}

export async function getAllArtworks(limit = 50, offset = 0): Promise<Artwork[]> {
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
}

export async function createArtwork(artworkData: Partial<Artwork>): Promise<Artwork | null> {
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
}

// Comment functions
export async function getCommentsByArtwork(artworkId: number): Promise<Comment[]> {
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
}

export async function createComment(commentData: {
  artwork_id: number
  user_id: number
  content: string
}): Promise<Comment | null> {
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
}

export async function updateComment(id: number, content: string): Promise<Comment | null> {
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
}

export async function deleteComment(id: number): Promise<boolean> {
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
}

// Like functions
export async function hasUserLikedArtwork(userId: number, artworkId: number): Promise<boolean> {
  try {
    const result = await sql`
      SELECT * FROM likes
      WHERE user_id = ${userId} AND artwork_id = ${artworkId}
    `
    return result.length > 0
  } catch (error) {
    console.error("Error checking if user liked artwork:", error)
    return false
  }
}

export async function getLikesByArtwork(artworkId: number): Promise<number> {
  try {
    const result = await sql`
      SELECT COUNT(*) as count FROM likes
      WHERE artwork_id = ${artworkId}
    `
    return Number.parseInt(result[0].count)
  } catch (error) {
    console.error("Error getting likes by artwork:", error)
    return 0
  }
}

export async function likeArtwork(userId: number, artworkId: number): Promise<boolean> {
  try {
    await sql`
      INSERT INTO likes (user_id, artwork_id)
      VALUES (${userId}, ${artworkId})
      ON CONFLICT (user_id, artwork_id) DO NOTHING
    `
    return true
  } catch (error) {
    console.error("Error liking artwork:", error)
    return false
  }
}

export async function unlikeArtwork(userId: number, artworkId: number): Promise<boolean> {
  try {
    await sql`
      DELETE FROM likes
      WHERE user_id = ${userId} AND artwork_id = ${artworkId}
    `
    return true
  } catch (error) {
    console.error("Error unliking artwork:", error)
    return false
  }
}

// Follow functions
export async function isUserFollowing(followerId: number, followingId: number): Promise<boolean> {
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
}

export async function followUser(followerId: number, followingId: number): Promise<boolean> {
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
}

export async function unfollowUser(followerId: number, followingId: number): Promise<boolean> {
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
}

export async function getFollowers(userId: number): Promise<User[]> {
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
}

export async function getFollowing(userId: number): Promise<User[]> {
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
}

export async function getFollowCounts(userId: number): Promise<{ followers: number; following: number }> {
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
}

// Wallet functions
export async function createWallet(walletData: {
  user_id: number
  address: string
  encrypted_private_key?: string
}): Promise<Wallet | null> {
  try {
    const result = await sql`
      INSERT INTO wallets (user_id, address, encrypted_private_key)
      VALUES (${walletData.user_id}, ${walletData.address}, ${walletData.encrypted_private_key || null})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating wallet:", error)
    return null
  }
}

export async function getWalletByUserId(userId: number): Promise<Wallet | null> {
  try {
    const result = await sql`
      SELECT * FROM wallets
      WHERE user_id = ${userId}
    `
    return result[0] || null
  } catch (error) {
    console.error("Error getting wallet by user ID:", error)
    return null
  }
}

export async function getWalletByAddress(address: string): Promise<Wallet | null> {
  try {
    const result = await sql`
      SELECT * FROM wallets
      WHERE address = ${address}
    `
    return result[0] || null
  } catch (error) {
    console.error("Error getting wallet by address:", error)
    return null
  }
}

// Database status function
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1`
    return true
  } catch (error) {
    console.error("Database connection error:", error)
    return false
  }
}

export async function getDatabaseTables(): Promise<string[]> {
  try {
    const result = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    return result.map((row) => row.table_name)
  } catch (error) {
    console.error("Error getting database tables:", error)
    return []
  }
}
