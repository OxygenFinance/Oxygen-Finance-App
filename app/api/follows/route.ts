import { NextResponse } from "next/server"
import { getFollowers, getFollowing, followUser, unfollowUser, isFollowing } from "@/lib/api-client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const type = searchParams.get("type")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const userIdNum = Number.parseInt(userId)
    if (isNaN(userIdNum)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    if (type === "followers") {
      const followers = await getFollowers(userIdNum)
      return NextResponse.json(followers)
    } else if (type === "following") {
      const following = await getFollowing(userIdNum)
      return NextResponse.json(following)
    } else {
      return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error fetching follows:", error)
    return NextResponse.json({ error: "Failed to fetch follows" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.follower_id || !body.following_id) {
      return NextResponse.json({ error: "Follower ID and following ID are required" }, { status: 400 })
    }

    const followerIdNum = Number.parseInt(body.follower_id)
    const followingIdNum = Number.parseInt(body.following_id)

    if (isNaN(followerIdNum) || isNaN(followingIdNum)) {
      return NextResponse.json({ error: "Invalid follower ID or following ID" }, { status: 400 })
    }

    // Check if already following
    const alreadyFollowing = await isFollowing(followerIdNum, followingIdNum)
    if (alreadyFollowing) {
      return NextResponse.json({ error: "Already following this user" }, { status: 409 })
    }

    const success = await followUser(followerIdNum, followingIdNum)

    if (!success) {
      return NextResponse.json({ error: "Failed to follow user" }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error("Error following user:", error)
    return NextResponse.json({ error: "Failed to follow user" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
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

    const success = await unfollowUser(followerIdNum, followingIdNum)

    if (!success) {
      return NextResponse.json({ error: "Not following this user or unfollow failed" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error unfollowing user:", error)
    return NextResponse.json({ error: "Failed to unfollow user" }, { status: 500 })
  }
}
