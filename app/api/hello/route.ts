import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "Hello from Oxygen Finance API",
    timestamp: new Date().toISOString(),
    status: "success",
  })
}
