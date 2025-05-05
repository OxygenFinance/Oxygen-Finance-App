import { NextResponse } from "next/server"
import { getAllArtworks, getArtworksByCreator, createArtwork } from "@/lib/api-client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const creatorId = searchParams.get("creatorId")
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined
    const offset = searchParams.get("offset") ? Number.parseInt(searchParams.get("offset")!) : undefined

    if (creatorId) {
      const creatorIdNum = Number.parseInt(creatorId)
      if (isNaN(creatorIdNum)) {
        return NextResponse.json({ error: "Invalid creator ID" }, { status: 400 })
      }

      const artworks = await getArtworksByCreator(creatorIdNum)
      return NextResponse.json(artworks)
    } else {
      const artworks = await getAllArtworks(limit, offset)
      return NextResponse.json(artworks)
    }
  } catch (error) {
    console.error("Error fetching artworks:", error)
    return NextResponse.json({ error: "Failed to fetch artworks" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Check for required fields
    if (!body.title || !body.media_url || !body.creator_id) {
      return NextResponse.json({ error: "Title, media URL, and creator ID are required" }, { status: 400 })
    }

    const newArtwork = await createArtwork(body)

    if (!newArtwork) {
      return NextResponse.json({ error: "Failed to create artwork" }, { status: 500 })
    }

    return NextResponse.json(newArtwork, { status: 201 })
  } catch (error) {
    console.error("Error creating artwork:", error)
    return NextResponse.json({ error: "Failed to create artwork" }, { status: 500 })
  }
}
