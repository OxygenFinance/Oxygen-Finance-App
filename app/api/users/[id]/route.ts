import { NextResponse } from "next/server"
import { getUserById, updateUser } from "@/lib/api-client"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id)

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const user = await getUserById(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id)

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const body = await request.json()
    const updatedUser = await updateUser(userId, body)

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found or update failed" }, { status: 404 })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
