import { NextResponse } from "next/server"
import { createUser, getUserByEmail, getUserByWalletAddress } from "@/lib/api-client"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Creating user with data:", body)

    // Check for required fields
    if (!body.email && !body.wallet_address) {
      return NextResponse.json({ error: "Email or wallet address is required" }, { status: 400 })
    }

    // Check if user already exists
    if (body.email) {
      const existingUser = await getUserByEmail(body.email)
      if (existingUser) {
        console.log("User with this email already exists:", existingUser)
        return NextResponse.json(existingUser, { status: 200 })
      }
    }

    if (body.wallet_address) {
      const existingUser = await getUserByWalletAddress(body.wallet_address)
      if (existingUser) {
        console.log("User with this wallet address already exists:", existingUser)
        return NextResponse.json(existingUser, { status: 200 })
      }
    }

    console.log("Creating new user...")
    const newUser = await createUser(body)

    if (!newUser) {
      console.error("Failed to create user")
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    console.log("User created successfully:", newUser)
    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
