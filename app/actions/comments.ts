"use server"

import { addComment, getComments } from "@/lib/db"

export async function submitComment(formData: FormData) {
  try {
    const artworkId = formData.get("artworkId") as string
    const userId = formData.get("userId") as string
    const username = formData.get("username") as string
    const profileImage = formData.get("profileImage") as string
    const text = formData.get("text") as string

    if (!artworkId || !userId || !username || !text) {
      return {
        success: false,
        message: "Missing required fields",
      }
    }

    const commentId = `comment-${Date.now()}`

    const comment = await addComment({
      id: commentId,
      artwork_id: artworkId,
      user_id: userId,
      username,
      profile_image: profileImage,
      text,
    })

    return {
      success: true,
      comment,
      message: "Comment added successfully",
    }
  } catch (error) {
    console.error("Error submitting comment:", error)
    return {
      success: false,
      message: "Failed to add comment",
    }
  }
}

export async function getArtworkComments(artworkId: string) {
  try {
    const comments = await getComments(artworkId)

    return {
      success: true,
      comments,
    }
  } catch (error) {
    console.error("Error getting comments:", error)
    return {
      success: false,
      message: "Failed to get comments",
    }
  }
}
