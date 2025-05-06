import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    const username = params.username

    if (!username) {
      return NextResponse.json({ error: "Twitter username is required" }, { status: 400 })
    }

    const users = await sql`
      SELECT * FROM users WHERE twitter = ${username}
    `

    if (users.length === 0) {
      return NextResponse.json(null, { status: 404 })
    }

    return NextResponse.json(users[0])
  } catch (error) {
    console.error("Error fetching user by Twitter username:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}
