import { NextResponse } from "next/server"
import { updateComment, deleteComment } from "@/lib/api-client"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const commentId = Number.parseInt(params.id)

    if (isNaN(commentId)) {
      return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 })
    }

    const body = await request.json()

    if (!body.content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const updatedComment = await updateComment(commentId, body.content)

    if (!updatedComment) {
      return NextResponse.json({ error: "Comment not found or update failed" }, { status: 404 })
    }

    return NextResponse.json(updatedComment)
  } catch (error) {
    console.error("Error updating comment:", error)
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const commentId = Number.parseInt(params.id)

    if (isNaN(commentId)) {
      return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 })
    }

    const success = await deleteComment(commentId)

    if (!success) {
      return NextResponse.json({ error: "Comment not found or delete failed" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting comment:", error)
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 })
  }
}
