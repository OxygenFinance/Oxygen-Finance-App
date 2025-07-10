import { NextResponse } from "next/server"

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const userId = Number.parseInt(params.id)

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    // Simple mock response for now
    const user = {
      id: userId,
      name: `User ${userId}`,
      username: `user${userId}`,
      email: `user${userId}@example.com`,
      bio: "Video creator on Oxygen Finance",
      avatar_url: `/placeholder.svg?height=100&width=100&seed=${userId}`,
      created_at: new Date().toISOString(),
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}
