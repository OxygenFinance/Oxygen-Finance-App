import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get("videoId")
    const artworkId = searchParams.get("artworkId")

    if (!videoId && !artworkId) {
      return NextResponse.json({ error: "Video ID or Artwork ID is required" }, { status: 400 })
    }

    const id = videoId || artworkId

    const comments = await sql`
      SELECT 
        c.*,
        u.name as username,
        u.avatar_url as profile_image
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.artwork_id = ${id}
      ORDER BY c.created_at DESC
    `

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { artwork_id, user_id, content, username, profile_image } = body

    if (!artwork_id || !user_id || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const comment = await sql`
      INSERT INTO comments (artwork_id, user_id, content)
      VALUES (${artwork_id}, ${user_id}, ${content})
      RETURNING *
    `

    // Return comment with user info
    const commentWithUser = {
      ...comment[0],
      username: username || `User ${user_id}`,
      profile_image: profile_image || null,
    }

    return NextResponse.json(commentWithUser, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}
