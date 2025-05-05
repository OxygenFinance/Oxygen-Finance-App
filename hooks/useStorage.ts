"use client"

import { useState, useEffect, useCallback } from "react"
import * as api from "@/lib/api-client"

export interface Comment {
  id: string
  artwork_id: string
  user_id: string
  username: string
  profile_image?: string
  text: string
  timestamp: Date | string
}

export function useComments(artworkId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!artworkId) return

    const fetchComments = async () => {
      setLoading(true)
      setError(null)
      try {
        const commentsData = await api.fetchCommentsByArtwork(artworkId)
        setComments(commentsData)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch comments"))
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [artworkId])

  const addComment = useCallback(
    async (commentData: Partial<Comment>) => {
      if (!artworkId) return null

      setLoading(true)
      setError(null)
      try {
        const newComment = await api.createComment({
          ...commentData,
          artwork_id: artworkId,
        })
        if (newComment) {
          setComments((prev) => [newComment, ...prev])
        }
        return newComment
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to add comment"))
        return null
      } finally {
        setLoading(false)
      }
    },
    [artworkId],
  )

  const updateComment = useCallback(async (commentId: string, text: string) => {
    setLoading(true)
    setError(null)
    try {
      const updatedComment = await api.updateComment(commentId, text)
      if (updatedComment) {
        setComments((prev) => prev.map((comment) => (comment.id === commentId ? updatedComment : comment)))
      }
      return updatedComment
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to update comment"))
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteComment = useCallback(async (commentId: string) => {
    setLoading(true)
    setError(null)
    try {
      const success = await api.deleteComment(commentId)
      if (success) {
        setComments((prev) => prev.filter((comment) => comment.id !== commentId))
      }
      return success
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to delete comment"))
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return { comments, loading, error, addComment, updateComment, deleteComment }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue] as const
}
