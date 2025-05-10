import { type NextRequest, NextResponse } from "next/server"
import { likeArtwork, unlikeArtwork, hasUserLikedArtwork, getLikesByArtwork } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { userId, artworkId } = await request.json()

    if (!userId || !artworkId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await likeArtwork(userId, artworkId)

    if (!result) {
      return NextResponse.json({ error: "Failed to like artwork" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error liking artwork:", error)
    return NextResponse.json({ error: "Failed to like artwork" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId, artworkId } = await request.json()

    if (!userId || !artworkId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await unlikeArtwork(userId, artworkId)

    if (!result) {
      return NextResponse.json({ error: "Failed to unlike artwork" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error unliking artwork:", error)
    return NextResponse.json({ error: "Failed to unlike artwork" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const artworkId = Number(searchParams.get("artworkId"))
    const userId = searchParams.get("userId") ? Number(searchParams.get("userId")) : null

    if (!artworkId) {
      return NextResponse.json({ error: "Artwork ID is required" }, { status: 400 })
    }

    if (userId) {
      // Check if user has liked the artwork
      const hasLiked = await hasUserLikedArtwork(userId, artworkId)
      return NextResponse.json({ hasLiked })
    } else {
      // Get total likes for the artwork
      const likesCount = await getLikesByArtwork(artworkId)
      return NextResponse.json({ likesCount })
    }
  } catch (error) {
    console.error("Error getting likes:", error)
    return NextResponse.json({ error: "Failed to get likes" }, { status: 500 })
  }
}
