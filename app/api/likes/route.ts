import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const artworkId = searchParams.get("artworkId")
    const userId = searchParams.get("userId")

    if (!artworkId) {
      return NextResponse.json({ error: "Artwork ID is required" }, { status: 400 })
    }

    // Get like count
    const likeCount = await sql`
      SELECT COUNT(*) as count
      FROM likes
      WHERE artwork_id = ${artworkId}
    `

    // Check if user has liked (if userId provided)
    let hasLiked = false
    if (userId) {
      const userLike = await sql`
        SELECT id
        FROM likes
        WHERE artwork_id = ${artworkId} AND user_id = ${userId}
      `
      hasLiked = userLike.length > 0
    }

    return NextResponse.json({
      count: Number.parseInt(likeCount[0].count),
      hasLiked,
    })
  } catch (error) {
    console.error("Error fetching likes:", error)
    return NextResponse.json({ error: "Failed to fetch likes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { artwork_id, user_id } = body

    if (!artwork_id || !user_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if already liked
    const existing = await sql`
      SELECT id FROM likes
      WHERE artwork_id = ${artwork_id} AND user_id = ${user_id}
    `

    if (existing.length > 0) {
      // Unlike
      await sql`
        DELETE FROM likes
        WHERE artwork_id = ${artwork_id} AND user_id = ${user_id}
      `
      return NextResponse.json({ liked: false })
    } else {
      // Like
      await sql`
        INSERT INTO likes (artwork_id, user_id)
        VALUES (${artwork_id}, ${user_id})
      `
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 })
  }
}
