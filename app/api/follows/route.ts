import { NextResponse } from "next/server"
import { getFollowers, getFollowing, getFollowCounts, followUser, unfollowUser, isFollowing } from "@/lib/api-client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const type = searchParams.get("type") // 'followers', 'following', or 'counts'

    console.log("Fetching follows with params:", { userId, type })

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Parse the user ID as a number
    const userIdNum = Number.parseInt(userId, 10)

    if (isNaN(userIdNum)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
    }

    let result
    switch (type) {
      case "followers":
        result = await getFollowers(userIdNum)
        break
      case "following":
        result = await getFollowing(userIdNum)
        break
      case "counts":
        result = await getFollowCounts(userIdNum)
        break
      default:
        // Default to counts if type is not specified
        result = await getFollowCounts(userIdNum)
    }

    console.log(`Found follow data:`, result)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching follows:", error)
    return NextResponse.json({ error: "Failed to fetch follows" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Processing follow operation:", body)

    // Check for required fields
    if (!body.followerId || !body.followingId) {
      return NextResponse.json({ error: "Follower ID and following ID are required" }, { status: 400 })
    }

    // Parse IDs as numbers
    const followerId = Number.parseInt(body.followerId, 10)
    const followingId = Number.parseInt(body.followingId, 10)

    if (isNaN(followerId) || isNaN(followingId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    // Check if already following
    const alreadyFollowing = await isFollowing(followerId, followingId)

    if (body.action === "unfollow") {
      if (!alreadyFollowing) {
        return NextResponse.json({ error: "Not following this user" }, { status: 400 })
      }

      const success = await unfollowUser(followerId, followingId)
      if (!success) {
        return NextResponse.json({ error: "Failed to unfollow user" }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: "Unfollowed successfully" })
    } else {
      // Default action is to follow
      if (alreadyFollowing) {
        return NextResponse.json({ error: "Already following this user" }, { status: 400 })
      }

      const success = await followUser(followerId, followingId)
      if (!success) {
        return NextResponse.json({ error: "Failed to follow user" }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: "Followed successfully" })
    }
  } catch (error) {
    console.error("Error processing follow operation:", error)
    return NextResponse.json({ error: "Failed to process follow operation" }, { status: 500 })
  }
}
