import { NextResponse } from "next/server"

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const videoId = Number.parseInt(params.id)

    if (isNaN(videoId)) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400 })
    }

    // Simple mock response for now
    const video = {
      id: videoId,
      title: `Sample Video ${videoId}`,
      description: "This is a sample video",
      media_url: "/videos/video-1.mp4",
      thumbnail_url: "/gallery-image1.png",
      creator_id: 1,
      created_at: new Date().toISOString(),
    }

    return NextResponse.json(video)
  } catch (error) {
    console.error("Error fetching video:", error)
    return NextResponse.json({ error: "Failed to fetch video" }, { status: 500 })
  }
}
