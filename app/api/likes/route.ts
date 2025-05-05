import { NextResponse } from "next/server"
import { likeArtwork, unlikeArtwork, hasUserLikedArtwork, getLikesByArtwork } from "@/lib/api-client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const artworkId = searchParams.get("artworkId")
    const userId = searchParams.get("userId")

    if (!artworkId) {
      return NextResponse.json({ error: "Artwork ID is required" }, { status: 400 })
    }

    const artworkIdNum = Number.parseInt(artworkId)
    if (isNaN(artworkIdNum)) {
      return NextResponse.json({ error: "Invalid artwork ID" }, { status: 400 })
    }

    // If userId is provided, check if the user has liked the artwork
    if (userId) {
      const userIdNum = Number.parseInt(userId)
      if (isNaN(userIdNum)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
      }

      const hasLiked = await hasUserLikedArtwork(userIdNum, artworkIdNum)
      return NextResponse.json({ hasLiked })
    }

    // Otherwise, get the total likes for the artwork
    const likesCount = await getLikesByArtwork(artworkIdNum)
    return NextResponse.json({ count: likesCount })
  } catch (error) {
    console.error("Error fetching likes:", error)
    return NextResponse.json({ error: "Failed to fetch likes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.user_id || !body.artwork_id) {
      return NextResponse.json({ error: "User ID and artwork ID are required" }, { status: 400 })
    }

    const userIdNum = Number.parseInt(body.user_id)
    const artworkIdNum = Number.parseInt(body.artwork_id)

    if (isNaN(userIdNum) || isNaN(artworkIdNum)) {
      return NextResponse.json({ error: "Invalid user ID or artwork ID" }, { status: 400 })
    }

    // Check if already liked
    const alreadyLiked = await hasUserLikedArtwork(userIdNum, artworkIdNum)
    if (alreadyLiked) {
      return NextResponse.json({ error: "Already liked this artwork" }, { status: 409 })
    }

    const success = await likeArtwork(userIdNum, artworkIdNum)

    if (!success) {
      return NextResponse.json({ error: "Failed to like artwork" }, { status: 500 })
    }

    const newLikesCount = await getLikesByArtwork(artworkIdNum)
    return NextResponse.json({ success: true, count: newLikesCount }, { status: 201 })
  } catch (error) {
    console.error("Error liking artwork:", error)
    return NextResponse.json({ error: "Failed to like artwork" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const artworkId = searchParams.get("artworkId")

    if (!userId || !artworkId) {
      return NextResponse.json({ error: "User ID and artwork ID are required" }, { status: 400 })
    }

    const userIdNum = Number.parseInt(userId)
    const artworkIdNum = Number.parseInt(artworkId)

    if (isNaN(userIdNum) || isNaN(artworkIdNum)) {
      return NextResponse.json({ error: "Invalid user ID or artwork ID" }, { status: 400 })
    }

    const success = await unlikeArtwork(userIdNum, artworkIdNum)

    if (!success) {
      return NextResponse.json({ error: "Not liked this artwork or unlike failed" }, { status: 404 })
    }

    const newLikesCount = await getLikesByArtwork(artworkIdNum)
    return NextResponse.json({ success: true, count: newLikesCount })
  } catch (error) {
    console.error("Error unliking artwork:", error)
    return NextResponse.json({ error: "Failed to unlike artwork" }, { status: 500 })
  }
}
