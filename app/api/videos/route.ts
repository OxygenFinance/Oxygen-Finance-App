import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Simple mock response for now
    const videos = [
      {
        id: 1,
        title: "Sample Video 1",
        description: "This is a sample video",
        media_url: "/videos/video-1.mp4",
        thumbnail_url: "/gallery-image1.png",
        creator_id: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        title: "Sample Video 2",
        description: "This is another sample video",
        media_url: "/videos/video-2.mp4",
        thumbnail_url: "/gallery-image2.png",
        creator_id: 2,
        created_at: new Date().toISOString(),
      },
    ]

    return NextResponse.json(videos)
  } catch (error) {
    console.error("Error fetching videos:", error)
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const newVideo = {
      id: Date.now(),
      title: body.title || "Untitled Video",
      description: body.description || "",
      media_url: body.media_url || "",
      thumbnail_url: body.thumbnail_url || "",
      creator_id: body.creator_id || 1,
      created_at: new Date().toISOString(),
    }

    return NextResponse.json(newVideo, { status: 201 })
  } catch (error) {
    console.error("Error creating video:", error)
    return NextResponse.json({ error: "Failed to create video" }, { status: 500 })
  }
}
