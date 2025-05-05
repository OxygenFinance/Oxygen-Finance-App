import { NextResponse } from "next/server"
import { checkDatabaseConnection, getDatabaseTables } from "@/lib/db"

export async function GET() {
  try {
    const isConnected = await checkDatabaseConnection()

    if (isConnected) {
      const tables = await getDatabaseTables()

      return NextResponse.json({
        status: "connected",
        message: "Successfully connected to the database",
        tables,
      })
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: "Failed to connect to the database",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error checking database status:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "Error checking database status",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
