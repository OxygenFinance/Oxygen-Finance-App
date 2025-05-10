import { type NextRequest, NextResponse } from "next/server"
import { followUser, unfollowUser, isUserFollowing } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { followerId, followingId } = await request.json()

    if (!followerId || !followingId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await followUser(followerId, followingId)

    if (!result) {
      return NextResponse.json({ error: "Failed to follow user" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error following user:", error)
    return NextResponse.json({ error: "Failed to follow user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { followerId, followingId } = await request.json()

    if (!followerId || !followingId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await unfollowUser(followerId, followingId)

    if (!result) {
      return NextResponse.json({ error: "Failed to unfollow user" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error unfollowing user:", error)
    return NextResponse.json({ error: "Failed to unfollow user" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const followerId = Number(searchParams.get("followerId"))
    const followingId = Number(searchParams.get("followingId"))

    if (!followerId || !followingId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const isFollowing = await isUserFollowing(followerId, followingId)

    return NextResponse.json({ isFollowing })
  } catch (error) {
    console.error("Error checking follow status:", error)
    return NextResponse.json({ error: "Failed to check follow status" }, { status: 500 })
  }
}
