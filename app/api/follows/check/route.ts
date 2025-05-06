import { NextResponse } from "next/server"
import { isUserFollowing } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const followerId = searchParams.get("followerId")
    const followingId = searchParams.get("followingId")

    if (!followerId || !followingId) {
      return NextResponse.json({ error: "Follower ID and following ID are required" }, { status: 400 })
    }

    const followerIdNum = Number.parseInt(followerId)
    const followingIdNum = Number.parseInt(followingId)

    if (isNaN(followerIdNum) || isNaN(followingIdNum)) {
      return NextResponse.json({ error: "Invalid follower ID or following ID" }, { status: 400 })
    }

    const isFollowing = await isUserFollowing(followerIdNum, followingIdNum)

    return NextResponse.json({ isFollowing })
  } catch (error) {
    console.error("Error checking follow status:", error)
    return NextResponse.json({ error: "Failed to check follow status" }, { status: 500 })
  }
}
