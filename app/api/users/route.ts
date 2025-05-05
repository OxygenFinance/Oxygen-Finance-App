import { NextResponse } from "next/server"
import { createUser, getUserByEmail, getUserByWalletAddress } from "@/lib/api-client"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Check for required fields
    if (!body.email && !body.wallet_address) {
      return NextResponse.json({ error: "Email or wallet address is required" }, { status: 400 })
    }

    // Check if user already exists
    if (body.email) {
      const existingUser = await getUserByEmail(body.email)
      if (existingUser) {
        return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
      }
    }

    if (body.wallet_address) {
      const existingUser = await getUserByWalletAddress(body.wallet_address)
      if (existingUser) {
        return NextResponse.json({ error: "User with this wallet address already exists" }, { status: 409 })
      }
    }

    const newUser = await createUser(body)

    if (!newUser) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
