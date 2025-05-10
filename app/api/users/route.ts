import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    if (!userData) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 })
    }

    const user = await createUser(userData)

    if (!user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
