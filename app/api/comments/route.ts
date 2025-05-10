import { type NextRequest, NextResponse } from "next/server"
import { createComment } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { artwork_id, user_id, content } = await request.json()

    if (!artwork_id || !user_id || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const comment = await createComment({ artwork_id, user_id, content })

    if (!comment) {
      return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
    }

    return NextResponse.json(comment)
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}
