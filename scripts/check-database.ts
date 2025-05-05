import { sql, getUserById, getArtworkById, getCommentsByArtwork, getFollowCounts, getLikesByArtwork } from "@/lib/db"

async function checkDatabase() {
  console.log("Checking database...")

  // Check users
  const userCount = await sql`SELECT COUNT(*) as count FROM users`
  console.log(`Users in database: ${userCount[0].count}`)

  // Check artworks
  const artworkCount = await sql`SELECT COUNT(*) as count FROM artworks`
  console.log(`Artworks in database: ${artworkCount[0].count}`)

  // Check follows
  const followCount = await sql`SELECT COUNT(*) as count FROM follows`
  console.log(`Follows in database: ${followCount[0].count}`)

  // Check likes
  const likeCount = await sql`SELECT COUNT(*) as count FROM likes`
  console.log(`Likes in database: ${likeCount[0].count}`)

  // Check comments
  const commentCount = await sql`SELECT COUNT(*) as count FROM comments`
  console.log(`Comments in database: ${commentCount[0].count}`)

  // Get a sample user
  if (Number(userCount[0].count) > 0) {
    const user = await getUserById(1)
    console.log("Sample user:", user)

    // Get follow counts for this user
    if (user) {
      const followCounts = await getFollowCounts(user.id)
      console.log(
        `User ${user.username} has ${followCounts.followers} followers and is following ${followCounts.following} users`,
      )
    }
  }

  // Get a sample artwork
  if (Number(artworkCount[0].count) > 0) {
    const artwork = await getArtworkById(1)
    console.log("Sample artwork:", artwork)

    // Get likes for this artwork
    if (artwork) {
      const likeCount = await getLikesByArtwork(artwork.id)
      console.log(`Artwork "${artwork.title}" has ${likeCount} likes`)

      // Get comments for this artwork
      const comments = await getCommentsByArtwork(artwork.id)
      console.log(`Artwork "${artwork.title}" has ${comments.length} comments:`)
      comments.forEach((comment, index) => {
        console.log(`${index + 1}. ${comment.content}`)
      })
    }
  }

  console.log("Database check completed!")
}

checkDatabase().catch((error) => {
  console.error("Error checking database:", error)
  process.exit(1)
})
