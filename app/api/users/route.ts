import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("walletAddress")
    const email = searchParams.get("email")

    // Mock users data
    const users = [
      {
        id: 1,
        name: "Video Creator 1",
        username: "creator1",
        email: "creator1@example.com",
        bio: "Professional video creator",
        avatar_url: "/placeholder.svg?height=100&width=100&seed=1",
        wallet_address: "0x1234567890123456789012345678901234567890",
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: "Video Creator 2",
        username: "creator2",
        email: "creator2@example.com",
        bio: "Digital video artist",
        avatar_url: "/placeholder.svg?height=100&width=100&seed=2",
        wallet_address: "0x0987654321098765432109876543210987654321",
        created_at: new Date().toISOString(),
      },
    ]

    // Filter by wallet address if provided
    if (walletAddress) {
      const user = users.find((u) => u.wallet_address === walletAddress)
      return NextResponse.json(user ? [user] : [])
    }

    // Filter by email if provided
    if (email) {
      const user = users.find((u) => u.email === email)
      return NextResponse.json(user ? [user] : [])
    }

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const newUser = {
      id: Date.now(),
      name: body.name || "New User",
      username: body.username || `user${Date.now()}`,
      email: body.email || "",
      bio: body.bio || "Video creator on Oxygen Finance",
      avatar_url: body.avatar_url || "/placeholder.svg?height=100&width=100",
      created_at: new Date().toISOString(),
    }

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
