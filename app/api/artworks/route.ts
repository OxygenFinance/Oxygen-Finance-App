import { type NextRequest, NextResponse } from "next/server"
import { getAllArtworks, createArtwork } from "@/lib/api-client"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Number(searchParams.get("limit") || "50")
    const offset = Number(searchParams.get("offset") || "0")

    const artworks = await getAllArtworks(limit, offset)

    return NextResponse.json(artworks)
  } catch (error) {
    console.error("Error fetching artworks:", error)
    return NextResponse.json({ error: "Failed to fetch artworks" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Creating artwork with data:", body)

    // Check for required fields
    if (!body.title || !body.media_url || !body.creator_id) {
      return NextResponse.json({ error: "Title, media URL, and creator ID are required" }, { status: 400 })
    }

    const newArtwork = await createArtwork(body)

    if (!newArtwork) {
      return NextResponse.json({ error: "Failed to create artwork" }, { status: 500 })
    }

    console.log("Artwork created successfully:", newArtwork)
    return NextResponse.json(newArtwork, { status: 201 })
  } catch (error) {
    console.error("Error creating artwork:", error)
    return NextResponse.json({ error: "Failed to create artwork" }, { status: 500 })
  }
}
