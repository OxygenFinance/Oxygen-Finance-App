import { sql } from "./db"
import { v4 as uuidv4 } from "uuid"

// Types
export interface User {
  id: string
  name?: string
  username?: string
  email?: string
  wallet_address: string
  profile_image?: string
  bio?: string
  twitter?: string
  instagram?: string
  website?: string
  created_at: Date
}

export interface Artwork {
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

export interface Comment {
  id: string
  artwork_id: string
  user_id: string
  username: string
  profile_image?: string
  text: string
  likes: number
  timestamp: Date
}

export interface Like {
  user_id: string
  artwork_id: string
  created_at?: string
}

export interface Follow {
  follower_id: string
  following_id: string
  created_at?: string
}

// User functions
export async function getUserById(id: string): Promise<User | null> {
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

export async function createUser(userData: Partial<User>): Promise<User | null> {
  try {
    const id = userData.id || uuidv4()

    const result = await sql`
      INSERT INTO users (
        id, name, username, email, wallet_address, profile_image, bio, twitter, instagram, website
      ) VALUES (
        ${id}, 
        ${userData.name || null}, 
        ${userData.username || null}, 
        ${userData.email || null}, 
        ${userData.wallet_address}, 
        ${userData.profile_image || null}, 
        ${userData.bio || null},
        ${userData.twitter || null},
        ${userData.instagram || null},
        ${userData.website || null}
      )
      RETURNING *
    `

    return result[0]
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

export async function updateUser(id: string, userData: Partial<User>): Promise<User | null> {
  try {
    // Get current user data
    const currentUser = await getUserById(id)
    if (!currentUser) return null

    // Update user with new data, keeping existing values if not provided
    const result = await sql`
      UPDATE users
      SET 
        name = COALESCE(${userData.name}, name),
        username = COALESCE(${userData.username}, username),
        email = COALESCE(${userData.email}, email),
        profile_image = COALESCE(${userData.profile_image}, profile_image),
        bio = COALESCE(${userData.bio}, bio),
        twitter = COALESCE(${userData.twitter}, twitter),
        instagram = COALESCE(${userData.instagram}, instagram),
        website = COALESCE(${userData.website}, website)
      WHERE id = ${id}
      RETURNING *
    `

    return result[0]
  } catch (error) {
    console.error("Error updating user:", error)
    return null
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    const result = await sql`
      DELETE FROM users
      WHERE id = ${id}
    `

    return result.count > 0
  } catch (error) {
    console.error("Error deleting user:", error)
    return false
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    return await sql`
      SELECT * FROM users
      ORDER BY created_at DESC
    `
  } catch (error) {
    console.error("Error getting all users:", error)
    return []
  }
}

export async function searchUsers(query: string, limit = 20): Promise<User[]> {
  const searchTerm = `%${query}%`

  const result = await sql`
    SELECT * FROM users
    WHERE 
      username ILIKE ${searchTerm} OR
      name ILIKE ${searchTerm} OR
      bio ILIKE ${searchTerm}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `

  return result
}

// Artwork functions
export async function getArtworkById(id: string): Promise<Artwork | null> {
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

export async function createArtwork(artworkData: Partial<Artwork>): Promise<Artwork | null> {
  try {
    const id = artworkData.id || uuidv4()

    const result = await sql`
      INSERT INTO artworks (
        id, title, description, image, content_url, creator_id, price, likes
      ) VALUES (
        ${id}, 
        ${artworkData.title}, 
        ${artworkData.description || null}, 
        ${artworkData.image || null}, 
        ${artworkData.content_url || null}, 
        ${artworkData.creator_id}, 
        ${artworkData.price || null},
        ${artworkData.likes || 0}
      )
      RETURNING *
    `

    return result[0]
  } catch (error) {
    console.error("Error creating artwork:", error)
    return null
  }
}

export async function updateArtwork(id: string, artworkData: Partial<Artwork>): Promise<Artwork | null> {
  try {
    // Get current artwork data
    const currentArtwork = await getArtworkById(id)
    if (!currentArtwork) return null

    // Update artwork with new data, keeping existing values if not provided
    const result = await sql`
      UPDATE artworks
      SET 
        title = COALESCE(${artworkData.title}, title),
        description = COALESCE(${artworkData.description}, description),
        image = COALESCE(${artworkData.image}, image),
        content_url = COALESCE(${artworkData.content_url}, content_url),
        price = COALESCE(${artworkData.price}, price),
        likes = COALESCE(${artworkData.likes}, likes)
      WHERE id = ${id}
      RETURNING *
    `

    return result[0]
  } catch (error) {
    console.error("Error updating artwork:", error)
    return null
  }
}

export async function deleteArtwork(id: string): Promise<boolean> {
  try {
    const result = await sql`
      DELETE FROM artworks
      WHERE id = ${id}
    `

    return result.count > 0
  } catch (error) {
    console.error("Error deleting artwork:", error)
    return false
  }
}

export async function getArtworksByCreator(creatorId: string): Promise<Artwork[]> {
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

export async function getAllArtworks(): Promise<Artwork[]> {
  try {
    return await sql`
      SELECT * FROM artworks 
      ORDER BY created_at DESC
    `
  } catch (error) {
    console.error("Error getting all artworks:", error)
    return []
  }
}

export async function searchArtworks(query: string, limit = 20): Promise<Artwork[]> {
  const searchTerm = `%${query}%`

  const result = await sql`
    SELECT * FROM artworks
    WHERE 
      title ILIKE ${searchTerm} OR
      description ILIKE ${searchTerm}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `

  return result
}

export async function getTrendingArtworks(limit = 10): Promise<Artwork[]> {
  try {
    return await sql`
      SELECT * FROM artworks 
      ORDER BY likes DESC, created_at DESC
      LIMIT ${limit}
    `
  } catch (error) {
    console.error("Error getting trending artworks:", error)
    return []
  }
}

// Comment functions
export async function getCommentById(id: string): Promise<Comment | null> {
  try {
    const result = await sql`
      SELECT * FROM comments 
      WHERE id = ${id}
    `
    return result[0] || null
  } catch (error) {
    console.error("Error getting comment by ID:", error)
    return null
  }
}

export async function getCommentsByArtwork(artworkId: string): Promise<Comment[]> {
  try {
    return await sql`
      SELECT * FROM comments 
      WHERE artwork_id = ${artworkId}
      ORDER BY timestamp DESC
    `
  } catch (error) {
    console.error("Error getting comments by artwork:", error)
    return []
  }
}

export async function createComment(commentData: Partial<Comment>): Promise<Comment | null> {
  try {
    const id = commentData.id || uuidv4()

    const result = await sql`
      INSERT INTO comments (
        id, artwork_id, user_id, username, profile_image, text, likes
      ) VALUES (
        ${id}, 
        ${commentData.artwork_id}, 
        ${commentData.user_id}, 
        ${commentData.username}, 
        ${commentData.profile_image || null}, 
        ${commentData.text},
        ${commentData.likes || 0}
      )
      RETURNING *
    `

    return result[0]
  } catch (error) {
    console.error("Error creating comment:", error)
    return null
  }
}

export async function updateComment(id: string, text: string): Promise<Comment | null> {
  try {
    const result = await sql`
      UPDATE comments
      SET text = ${text}
      WHERE id = ${id}
      RETURNING *
    `

    return result[0]
  } catch (error) {
    console.error("Error updating comment:", error)
    return null
  }
}

export async function deleteComment(id: string): Promise<boolean> {
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

export async function getCommentsByUser(userId: string, limit = 50): Promise<Comment[]> {
  const result = await sql`
    SELECT * FROM comments
    WHERE user_id = ${userId}
    ORDER BY timestamp DESC
    LIMIT ${limit}
  `

  return result
}

// Like functions
export async function hasLiked(userId: string, artworkId: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT * FROM likes
      WHERE user_id = ${userId} AND artwork_id = ${artworkId}
    `
    return result.length > 0
  } catch (error) {
    console.error("Error checking if liked:", error)
    return false
  }
}

export async function likeArtwork(userId: string, artworkId: string): Promise<number> {
  try {
    // Add like record
    await sql`
      INSERT INTO likes (user_id, artwork_id)
      VALUES (${userId}, ${artworkId})
      ON CONFLICT (user_id, artwork_id) DO NOTHING
    `

    // Update artwork likes count
    const likesCount = await sql`
      SELECT COUNT(*) as count FROM likes
      WHERE artwork_id = ${artworkId}
    `

    await sql`
      UPDATE artworks
      SET likes = ${Number.parseInt(likesCount[0].count)}
      WHERE id = ${artworkId}
    `

    return Number.parseInt(likesCount[0].count)
  } catch (error) {
    console.error("Error liking artwork:", error)
    throw error
  }
}

export async function unlikeArtwork(userId: string, artworkId: string): Promise<number> {
  try {
    // Remove like record
    await sql`
      DELETE FROM likes
      WHERE user_id = ${userId} AND artwork_id = ${artworkId}
    `

    // Update artwork likes count
    const likesCount = await sql`
      SELECT COUNT(*) as count FROM likes
      WHERE artwork_id = ${artworkId}
    `

    await sql`
      UPDATE artworks
      SET likes = ${Number.parseInt(likesCount[0].count)}
      WHERE id = ${artworkId}
    `

    return Number.parseInt(likesCount[0].count)
  } catch (error) {
    console.error("Error unliking artwork:", error)
    throw error
  }
}

export async function getLikedArtworks(userId: string): Promise<Artwork[]> {
  try {
    return await sql`
      SELECT a.* FROM artworks a
      JOIN likes l ON a.id = l.artwork_id
      WHERE l.user_id = ${userId}
      ORDER BY a.created_at DESC
    `
  } catch (error) {
    console.error("Error getting liked artworks:", error)
    return []
  }
}

export async function hasUserLikedArtwork(userId: string, artworkId: string): Promise<boolean> {
  const result = await sql`
    SELECT * FROM likes
    WHERE user_id = ${userId} AND artwork_id = ${artworkId}
  `

  return result.length > 0
}

export async function getLikedArtworksByUser(userId: string, limit = 50): Promise<Artwork[]> {
  const result = await sql`
    SELECT a.* FROM artworks a
    JOIN likes l ON a.id = l.artwork_id
    WHERE l.user_id = ${userId}
    ORDER BY l.created_at DESC
    LIMIT ${limit}
  `

  return result
}

// Follow functions
export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
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

export async function followUser(followerId: string, followingId: string): Promise<boolean> {
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

export async function unfollowUser(followerId: string, followingId: string): Promise<boolean> {
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

export async function getFollowers(userId: string): Promise<User[]> {
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

export async function getFollowing(userId: string): Promise<User[]> {
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

export async function getFollowCounts(userId: string): Promise<{ followers: number; following: number }> {
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

// Statistics and aggregation
export async function getUserStats(userId: string): Promise<{
  artworksCount: number
  likesReceived: number
  commentsReceived: number
  followersCount: number
  followingCount: number
}> {
  const artworksCount = await sql`
    SELECT COUNT(*) as count FROM artworks
    WHERE creator_id = ${userId}
  `

  const likesReceived = await sql`
    SELECT SUM(a.likes) as count FROM artworks a
    WHERE a.creator_id = ${userId}
  `

  const commentsReceived = await sql`
    SELECT COUNT(*) as count FROM comments c
    JOIN artworks a ON c.artwork_id = a.id
    WHERE a.creator_id = ${userId}
  `

  const followCounts = await getFollowCounts(userId)

  return {
    artworksCount: Number.parseInt(artworksCount[0].count) || 0,
    likesReceived: Number.parseInt(likesReceived[0].count) || 0,
    commentsReceived: Number.parseInt(commentsReceived[0].count) || 0,
    followersCount: followCounts.followers,
    followingCount: followCounts.following,
  }
}

// Activity functions
export async function getRecentActivity(limit = 20): Promise<any[]> {
  try {
    // Get recent likes
    const likes = await sql`
      SELECT 
        'like' as type,
        l.user_id,
        u.username as user_name,
        u.profile_image as user_image,
        l.artwork_id,
        a.title as artwork_title,
        a.image as artwork_image,
        l.created_at as timestamp
      FROM likes l
      JOIN users u ON l.user_id = u.id
      JOIN artworks a ON l.artwork_id = a.id
      ORDER BY l.created_at DESC
      LIMIT ${limit}
    `

    // Get recent comments
    const comments = await sql`
      SELECT 
        'comment' as type,
        c.user_id,
        c.username as user_name,
        c.profile_image as user_image,
        c.artwork_id,
        a.title as artwork_title,
        a.image as artwork_image,
        c.text as comment_text,
        c.timestamp
      FROM comments c
      JOIN artworks a ON c.artwork_id = a.id
      ORDER BY c.timestamp DESC
      LIMIT ${limit}
    `

    // Get recent follows
    const follows = await sql`
      SELECT 
        'follow' as type,
        f.follower_id as user_id,
        u1.username as user_name,
        u1.profile_image as user_image,
        f.following_id,
        u2.username as following_name,
        u2.profile_image as following_image,
        f.created_at as timestamp
      FROM follows f
      JOIN users u1 ON f.follower_id = u1.id
      JOIN users u2 ON f.following_id = u2.id
      ORDER BY f.created_at DESC
      LIMIT ${limit}
    `

    // Get recent artworks
    const artworks = await sql`
      SELECT 
        'artwork' as type,
        a.creator_id as user_id,
        u.username as user_name,
        u.profile_image as user_image,
        a.id as artwork_id,
        a.title as artwork_title,
        a.image as artwork_image,
        a.created_at as timestamp
      FROM artworks a
      JOIN users u ON a.creator_id = u.id
      ORDER BY a.created_at DESC
      LIMIT ${limit}
    `

    // Combine and sort by timestamp
    const allActivity = [...likes, ...comments, ...follows, ...artworks]
    allActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return allActivity.slice(0, limit)
  } catch (error) {
    console.error("Error getting recent activity:", error)
    return []
  }
}
