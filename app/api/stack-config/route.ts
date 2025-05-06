import { NextResponse } from "next/server"

export async function GET() {
  // Return only the publishable key that's safe to use on the client
  return NextResponse.json({
    projectId: process.env.STACK_PROJECT_ID,
    publishableKey: process.env.STACK_PUBLISHABLE_CLIENT_KEY,
  })
}
