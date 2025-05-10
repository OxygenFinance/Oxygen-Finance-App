import { type NextRequest, NextResponse } from "next/server"
import { getCommentsByArtwork, updateComment, deleteComment } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const artworkId = Number.parseInt(params.id)

    if (isNaN(artworkId)) {
      return NextResponse.json({ error: "Invalid artwork ID" }, { status: 400 })
    }

    const comments = await getCommentsByArtwork(artworkId)

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const commentId = Number.parseInt(params.id)
    const { content } = await request.json()

    if (isNaN(commentId)) {
      return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 })
    }

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const comment = await updateComment(commentId, content)

    if (!comment) {
      return NextResponse.json({ error: "Failed to update comment" }, { status: 500 })
    }

    return NextResponse.json(comment)
  } catch (error) {
    console.error("Error updating comment:", error)
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const commentId = Number.parseInt(params.id)

    if (isNaN(commentId)) {
      return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 })
    }

    const result = await deleteComment(commentId)

    if (!result) {
      return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting comment:", error)
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 })
  }
}
