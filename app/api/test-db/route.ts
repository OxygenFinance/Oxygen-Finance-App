import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Simple query to test database connection
    const result = await sql`SELECT NOW()`

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      timestamp: result[0].now,
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
