"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useAuth } from "./AuthContext"
import * as api from "@/lib/api-client"
import type { User } from "@/lib/api-client"

interface FollowContextType {
  isFollowing: (userId: number, creatorId: number) => Promise<boolean>
  toggleFollow: (creatorId: number) => Promise<boolean>
  followUser: (followerId: number, followingId: number) => Promise<boolean>
  unfollowUser: (followerId: number, followingId: number) => Promise<boolean>
  getFollowers: (userId: number) => Promise<User[]>
  getFollowing: (userId: number) => Promise<User[]>
  getFollowCounts: (userId: number) => Promise<{ followers: number; following: number }>
}

const FollowContext = createContext<FollowContextType | undefined>(undefined)

export function useFollow() {
  const context = useContext(FollowContext)
  if (context === undefined) {
    throw new Error("useFollow must be used within a FollowProvider")
  }
  return context
}

export function FollowProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  const isFollowing = async (userId: number, creatorId: number): Promise<boolean> => {
    try {
      return await api.isFollowing(userId, creatorId)
    } catch (error) {
      console.error("Error checking if following:", error)
      return false
    }
  }

  const toggleFollow = async (creatorId: number): Promise<boolean> => {
    if (!user?.id) return false

    try {
      const following = await isFollowing(user.id, creatorId)

      if (following) {
        return await unfollowUser(user.id, creatorId)
      } else {
        return await followUser(user.id, creatorId)
      }
    } catch (error) {
      console.error("Error toggling follow:", error)
      return false
    }
  }

  const followUser = async (followerId: number, followingId: number): Promise<boolean> => {
    try {
      return await api.followUser(followerId, followingId)
    } catch (error) {
      console.error("Error following user:", error)
      return false
    }
  }

  const unfollowUser = async (followerId: number, followingId: number): Promise<boolean> => {
    try {
      return await api.unfollowUser(followerId, followingId)
    } catch (error) {
      console.error("Error unfollowing user:", error)
      return false
    }
  }

  const getFollowers = async (userId: number): Promise<User[]> => {
    try {
      return await api.getFollowers(userId)
    } catch (error) {
      console.error("Error getting followers:", error)
      return []
    }
  }

  const getFollowing = async (userId: number): Promise<User[]> => {
    try {
      return await api.getFollowing(userId)
    } catch (error) {
      console.error("Error getting following:", error)
      return []
    }
  }

  const getFollowCounts = async (userId: number): Promise<{ followers: number; following: number }> => {
    try {
      return await api.getFollowCounts(userId)
    } catch (error) {
      console.error("Error getting follow counts:", error)
      return { followers: 0, following: 0 }
    }
  }

  return (
    <FollowContext.Provider
      value={{
        isFollowing,
        toggleFollow,
        followUser,
        unfollowUser,
        getFollowers,
        getFollowing,
        getFollowCounts,
      }}
    >
      {children}
    </FollowContext.Provider>
  )
}
