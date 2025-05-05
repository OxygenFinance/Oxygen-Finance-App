import { NextResponse } from "next/server"
import { getArtworkById } from "@/lib/api-client"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const artworkId = Number.parseInt(params.id)

    if (isNaN(artworkId)) {
      return NextResponse.json({ error: "Invalid artwork ID" }, { status: 400 })
    }

    const artwork = await getArtworkById(artworkId)

    if (!artwork) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 })
    }

    return NextResponse.json(artwork)
  } catch (error) {
    console.error("Error fetching artwork:", error)
    return NextResponse.json({ error: "Failed to fetch artwork" }, { status: 500 })
  }
}
