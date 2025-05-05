import { neon } from "@neondatabase/serverless"
import dotenv from "dotenv"

// Load environment variables from .env file if present
dotenv.config()

// Get the connection string from environment variables
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error("❌ DATABASE_URL environment variable is not set")
  process.exit(1)
}

// Initialize the SQL client
const sql = neon(connectionString)

async function seedDatabase() {
  console.log("Starting database seeding...")

  try {
    // Check if users table exists and has data
    const userCheck = await sql`SELECT COUNT(*) as count FROM users`

    if (Number.parseInt(userCheck[0].count) > 0) {
      console.log("⚠️ Database already has users. Do you want to proceed and add more data? (y/n)")
      // In a real script, you would wait for user input here
      // For this example, we'll proceed
    }

    console.log("Creating sample users...")

    // Create sample users
    const users = await Promise.all([
      sql`
        INSERT INTO users (name, username, bio, avatar_url, email)
        VALUES (
          'Alice Johnson', 
          'alice', 
          'Digital artist exploring the boundaries of NFTs and blockchain art', 
          'https://api.dicebear.com/7.x/adventurer/svg?seed=Alice',
          'alice@example.com'
        )
        RETURNING *
      `,
      sql`
        INSERT INTO users (name, username, bio, avatar_url, email)
        VALUES (
          'Bob Smith', 
          'bob', 
          'Collector of rare digital assets and crypto enthusiast', 
          'https://api.dicebear.com/7.x/adventurer/svg?seed=Bob',
          'bob@example.com'
        )
        RETURNING *
      `,
      sql`
        INSERT INTO users (name, username, bio, avatar_url, email)
        VALUES (
          'Charlie Davis', 
          'charlie', 
          'Blockchain developer and NFT creator', 
          'https://api.dicebear.com/7.x/adventurer/svg?seed=Charlie',
          'charlie@example.com'
        )
        RETURNING *
      `,
      sql`
        INSERT INTO users (name, username, bio, avatar_url, email)
        VALUES (
          'Diana Wilson', 
          'diana', 
          'Art curator specializing in digital and blockchain art', 
          'https://api.dicebear.com/7.x/adventurer/svg?seed=Diana',
          'diana@example.com'
        )
        RETURNING *
      `,
      sql`
        INSERT INTO users (name, username, bio, avatar_url, email)
        VALUES (
          'Ethan Brown', 
          'ethan', 
          'Crypto investor and NFT collector', 
          'https://api.dicebear.com/7.x/adventurer/svg?seed=Ethan',
          'ethan@example.com'
        )
        RETURNING *
      `,
    ])

    console.log(`✅ Created ${users.length} sample users`)

    // Extract user IDs for reference
    const userIds = users.map((userResult) => userResult[0].id)

    console.log("Creating sample artworks...")

    // Create sample artworks
    const artworks = await Promise.all([
      sql`
        INSERT INTO artworks (title, description, media_url, thumbnail_url, creator_id)
        VALUES (
          'Digital Dreamscape', 
          'An exploration of digital consciousness in the age of AI', 
          'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-city-11748-large.mp4',
          'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-city-11748-large.mp4',
          ${userIds[0]}
        )
        RETURNING *
      `,
      sql`
        INSERT INTO artworks (title, description, media_url, thumbnail_url, creator_id)
        VALUES (
          'Blockchain Visions', 
          'Visualizing the decentralized future through abstract art', 
          'https://assets.mixkit.co/videos/preview/mixkit-animation-of-futuristic-devices-99786-large.mp4',
          'https://assets.mixkit.co/videos/preview/mixkit-animation-of-futuristic-devices-99786-large.mp4',
          ${userIds[1]}
        )
        RETURNING *
      `,
      sql`
        INSERT INTO artworks (title, description, media_url, thumbnail_url, creator_id)
        VALUES (
          'Crypto Cosmos', 
          'A journey through the crypto universe', 
          'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4',
          'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4',
          ${userIds[2]}
        )
        RETURNING *
      `,
      sql`
        INSERT INTO artworks (title, description, media_url, thumbnail_url, creator_id)
        VALUES (
          'NFT Genesis', 
          'The beginning of a new era in digital ownership', 
          'https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-movement-11744-large.mp4',
          'https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-movement-11744-large.mp4',
          ${userIds[3]}
        )
        RETURNING *
      `,
      sql`
        INSERT INTO artworks (title, description, media_url, thumbnail_url, creator_id)
        VALUES (
          'Metaverse Memories', 
          'Capturing moments in the digital realm', 
          'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-city-11748-large.mp4',
          'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-city-11748-large.mp4',
          ${userIds[4]}
        )
        RETURNING *
      `,
    ])

    console.log(`✅ Created ${artworks.length} sample artworks`)

    // Extract artwork IDs for reference
    const artworkIds = artworks.map((artworkResult) => artworkResult[0].id)

    console.log("Creating sample follows...")

    // Create sample follows
    const follows = await Promise.all([
      sql`
        INSERT INTO follows (follower_id, following_id)
        VALUES (${userIds[0]}, ${userIds[1]})
        ON CONFLICT (follower_id, following_id) DO NOTHING
        RETURNING *
      `,
      sql`
        INSERT INTO follows (follower_id, following_id)
        VALUES (${userIds[0]}, ${userIds[2]})
        ON CONFLICT (follower_id, following_id) DO NOTHING
        RETURNING *
      `,
      sql`
        INSERT INTO follows (follower_id, following_id)
        VALUES (${userIds[1]}, ${userIds[0]})
        ON CONFLICT (follower_id, following_id) DO NOTHING
        RETURNING *
      `,
      sql`
        INSERT INTO follows (follower_id, following_id)
        VALUES (${userIds[2]}, ${userIds[0]})
        ON CONFLICT (follower_id, following_id) DO NOTHING
        RETURNING *
      `,
      sql`
        INSERT INTO follows (follower_id, following_id)
        VALUES (${userIds[3]}, ${userIds[0]})
        ON CONFLICT (follower_id, following_id) DO NOTHING
        RETURNING *
      `,
      sql`
        INSERT INTO follows (follower_id, following_id)
        VALUES (${userIds[4]}, ${userIds[0]})
        ON CONFLICT (follower_id, following_id) DO NOTHING
        RETURNING *
      `,
    ])

    console.log(`✅ Created ${follows.filter((f) => f.length > 0).length} sample follows`)

    console.log("Creating sample likes...")

    // Create sample likes
    const likes = await Promise.all([
      sql`
        INSERT INTO likes (user_id, artwork_id)
        VALUES (${userIds[0]}, ${artworkIds[1]})
        ON CONFLICT (user_id, artwork_id) DO NOTHING
        RETURNING *
      `,
      sql`
        INSERT INTO likes (user_id, artwork_id)
        VALUES (${userIds[0]}, ${artworkIds[2]})
        ON CONFLICT (user_id, artwork_id) DO NOTHING
        RETURNING *
      `,
      sql`
        INSERT INTO likes (user_id, artwork_id)
        VALUES (${userIds[1]}, ${artworkIds[0]})
        ON CONFLICT (user_id, artwork_id) DO NOTHING
        RETURNING *
      `,
      sql`
        INSERT INTO likes (user_id, artwork_id)
        VALUES (${userIds[2]}, ${artworkIds[0]})
        ON CONFLICT (user_id, artwork_id) DO NOTHING
        RETURNING *
      `,
      sql`
        INSERT INTO likes (user_id, artwork_id)
        VALUES (${userIds[3]}, ${artworkIds[0]})
        ON CONFLICT (user_id, artwork_id) DO NOTHING
        RETURNING *
      `,
    ])

    console.log(`✅ Created ${likes.filter((l) => l.length > 0).length} sample likes`)

    console.log("Creating sample comments...")

    // Create sample comments
    const comments = await Promise.all([
      sql`
        INSERT INTO comments (user_id, artwork_id, content)
        VALUES (
          ${userIds[1]}, 
          ${artworkIds[0]}, 
          'This is absolutely stunning! The detail is incredible.'
        )
        RETURNING *
      `,
      sql`
        INSERT INTO comments (user_id, artwork_id, content)
        VALUES (
          ${userIds[2]}, 
          ${artworkIds[0]}, 
          'I love the concept behind this piece. Very thought-provoking.'
        )
        RETURNING *
      `,
      sql`
        INSERT INTO comments (user_id, artwork_id, content)
        VALUES (
          ${userIds[0]}, 
          ${artworkIds[1]}, 
          'The colors in this are so vibrant! Amazing work.'
        )
        RETURNING *
      `,
      sql`
        INSERT INTO comments (user_id, artwork_id, content)
        VALUES (
          ${userIds[3]}, 
          ${artworkIds[2]}, 
          'This reminds me of the early days of crypto art. Nostalgic!'
        )
        RETURNING *
      `,
      sql`
        INSERT INTO comments (user_id, artwork_id, content)
        VALUES (
          ${userIds[4]}, 
          ${artworkIds[3]}, 
          'The technical execution here is flawless. Would love to know more about your process.'
        )
        RETURNING *
      `,
    ])

    console.log(`✅ Created ${comments.length} sample comments`)

    console.log("✅ Database seeding completed successfully!")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
  }
}

seedDatabase().catch(console.error)
