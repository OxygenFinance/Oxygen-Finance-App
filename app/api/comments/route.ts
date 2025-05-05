import { NextResponse } from "next/server"
import { getCommentsByArtwork, createComment } from "@/lib/api-client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const artworkId = searchParams.get("artworkId")

    if (!artworkId) {
      return NextResponse.json({ error: "Artwork ID is required" }, { status: 400 })
    }

    const artworkIdNum = Number.parseInt(artworkId)
    if (isNaN(artworkIdNum)) {
      return NextResponse.json({ error: "Invalid artwork ID" }, { status: 400 })
    }

    const comments = await getCommentsByArtwork(artworkIdNum)
    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.artwork_id || !body.user_id || !body.content) {
      return NextResponse.json({ error: "Artwork ID, user ID, and content are required" }, { status: 400 })
    }

    const artworkIdNum = Number.parseInt(body.artwork_id)
    const userIdNum = Number.parseInt(body.user_id)

    if (isNaN(artworkIdNum) || isNaN(userIdNum)) {
      return NextResponse.json({ error: "Invalid artwork ID or user ID" }, { status: 400 })
    }

    const comment = await createComment({
      artwork_id: artworkIdNum,
      user_id: userIdNum,
      content: body.content,
    })

    if (!comment) {
      return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
    }

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}
