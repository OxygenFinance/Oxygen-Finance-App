"use client"

import { useState, useEffect, useCallback } from "react"
import * as api from "@/lib/api-client"
import type { Comment } from "@/lib/api-client"

export function useComments(artworkId: number | null) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!artworkId) return

    const fetchComments = async () => {
      setLoading(true)
      setError(null)
      try {
        const commentsData = await api.getCommentsByArtwork(artworkId)
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
    async (content: string, userId: number) => {
      if (!artworkId) return null

      setLoading(true)
      setError(null)
      try {
        const newComment = await api.createComment({
          artwork_id: artworkId,
          user_id: userId,
          content,
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

  const updateComment = useCallback(async (commentId: number, content: string) => {
    setLoading(true)
    setError(null)
    try {
      const updatedComment = await api.updateComment(commentId, content)
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

  const deleteComment = useCallback(async (commentId: number) => {
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
