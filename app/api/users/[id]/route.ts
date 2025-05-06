import { NextResponse } from "next/server"
import { getUserById } from "@/lib/api-client"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    console.log("Fetching user with ID:", id)

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Parse the ID as a number
    const userId = Number.parseInt(id, 10)

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
    }

    const user = await getUserById(userId)

    if (!user) {
      console.log("User not found with ID:", id)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("User found:", user)
    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}
