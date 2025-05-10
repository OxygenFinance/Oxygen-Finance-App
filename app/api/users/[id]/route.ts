import { type NextRequest, NextResponse } from "next/server"
import { getUserById } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id)

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const user = await getUserById(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Don't return sensitive information
    const safeUser = {
      id: user.id,
      name: user.name,
      username: user.username,
      bio: user.bio,
      avatar_url: user.avatar_url,
      twitter_id: user.twitter_id,
      wallet_address: user.wallet_address,
      created_at: user.created_at,
    }

    return NextResponse.json(safeUser)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}
