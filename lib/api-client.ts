import * as db from "./db"

// Re-export types from db.ts
export type User = db.User
export type Artwork = db.Artwork
export type Comment = db.Comment
export type Like = db.Like
export type Follow = db.Follow
export type Wallet = db.Wallet

// User functions
export async function getUserById(id: number): Promise<User | null> {
  return await db.getUserById(id)
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return await db.getUserByEmail(email)
}

export async function getUserByWalletAddress(walletAddress: string): Promise<User | null> {
  return await db.getUserByWalletAddress(walletAddress)
}

export async function getUserByTwitterId(twitterId: string): Promise<User | null> {
  return await db.getUserByTwitterId(twitterId)
}

export async function createUser(userData: Partial<User>): Promise<User | null> {
  return await db.createUser(userData)
}

export async function updateUser(id: number, userData: Partial<User>): Promise<User | null> {
  return await db.updateUser(id, userData)
}

// Artwork functions
export async function getArtworkById(id: number): Promise<Artwork | null> {
  return await db.getArtworkById(id)
}

export async function getArtworksByCreator(creatorId: number): Promise<Artwork[]> {
  return await db.getArtworksByCreator(creatorId)
}

export async function getAllArtworks(limit?: number, offset?: number): Promise<Artwork[]> {
  return await db.getAllArtworks(limit, offset)
}

export async function createArtwork(artworkData: Partial<Artwork>): Promise<Artwork | null> {
  return await db.createArtwork(artworkData)
}

// Comment functions
export async function getCommentsByArtwork(artworkId: number): Promise<Comment[]> {
  return await db.getCommentsByArtwork(artworkId)
}

export async function createComment(commentData: {
  artwork_id: number
  user_id: number
  content: string
}): Promise<Comment | null> {
  return await db.createComment(commentData)
}

export async function updateComment(id: number, content: string): Promise<Comment | null> {
  return await db.updateComment(id, content)
}

export async function deleteComment(id: number): Promise<boolean> {
  return await db.deleteComment(id)
}

// Like functions
export async function hasUserLikedArtwork(userId: number, artworkId: number): Promise<boolean> {
  return await db.hasUserLikedArtwork(userId, artworkId)
}

export async function getLikesByArtwork(artworkId: number): Promise<number> {
  return await db.getLikesByArtwork(artworkId)
}

export async function likeArtwork(userId: number, artworkId: number): Promise<boolean> {
  return await db.likeArtwork(userId, artworkId)
}

export async function unlikeArtwork(userId: number, artworkId: number): Promise<boolean> {
  return await db.unlikeArtwork(userId, artworkId)
}

// Follow functions
export async function isFollowing(followerId: number, followingId: number): Promise<boolean> {
  return await db.isUserFollowing(followerId, followingId)
}

export async function followUser(followerId: number, followingId: number): Promise<boolean> {
  return await db.followUser(followerId, followingId)
}

export async function unfollowUser(followerId: number, followingId: number): Promise<boolean> {
  return await db.unfollowUser(followerId, followingId)
}

export async function getFollowers(userId: number): Promise<User[]> {
  return await db.getFollowers(userId)
}

export async function getFollowing(userId: number): Promise<User[]> {
  return await db.getFollowing(userId)
}

export async function getFollowCounts(userId: number): Promise<{ followers: number; following: number }> {
  return await db.getFollowCounts(userId)
}

// Wallet functions
export async function createWallet(walletData: {
  user_id: number
  address: string
  encrypted_private_key?: string
}): Promise<Wallet | null> {
  return await db.createWallet(walletData)
}

export async function getWalletByUserId(userId: number): Promise<Wallet | null> {
  return await db.getWalletByUserId(userId)
}

export async function getWalletByAddress(address: string): Promise<Wallet | null> {
  return await db.getWalletByAddress(address)
}

// Database status functions
export async function checkDatabaseConnection(): Promise<boolean> {
  return await db.checkDatabaseConnection()
}

export async function getDatabaseTables(): Promise<string[]> {
  return await db.getDatabaseTables()
}

// Export namespace for compatibility with existing code
export const api = {
  getUserById,
  getUserByEmail,
  getUserByWalletAddress,
  getUserByTwitterId,
  createUser,
  updateUser,
  getArtworkById,
  getArtworksByCreator,
  getAllArtworks,
  createArtwork,
  getCommentsByArtwork,
  createComment,
  updateComment,
  deleteComment,
  hasUserLikedArtwork,
  getLikesByArtwork,
  likeArtwork,
  unlikeArtwork,
  isFollowing,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getFollowCounts,
  createWallet,
  getWalletByUserId,
  getWalletByAddress,
  checkDatabaseConnection,
  getDatabaseTables,
}
