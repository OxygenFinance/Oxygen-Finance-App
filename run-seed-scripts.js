// Since we can't directly run TypeScript files, let's create the seeding logic in JavaScript
import { neon } from "@neondatabase/serverless"

// Use the DATABASE_URL from environment variables
const sql = neon(process.env.DATABASE_URL)

async function seedDatabase() {
  console.log("🚀 Starting database seeding for Video HUB...")

  try {
    // First, let's insert the sample users
    console.log("👥 Creating sample users...")

    const users = await Promise.all([
      sql`
        INSERT INTO users (id, name, username, email, wallet_address, bio, twitter, instagram, website, avatar_url)
        VALUES (
          'user-1', 
          'Neon Dreams', 
          'neondreams', 
          'neon@example.com', 
          '0x1234567890123456789012345678901234567890',
          'Video creator specializing in cyberpunk and futuristic content.',
          'neondreams',
          'neondreams',
          'https://neondreams.art',
          'https://api.dicebear.com/7.x/adventurer/svg?seed=NeonDreams'
        )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
      `,
      sql`
        INSERT INTO users (id, name, username, email, wallet_address, bio, twitter, instagram, website, avatar_url)
        VALUES (
          'user-2', 
          'Cosmic Voyager', 
          'cosmicvoyager', 
          'cosmic@example.com', 
          '0x2345678901234567890123456789012345678901',
          'Creating ethereal space-themed videos and animations.',
          'cosmicvoyager',
          'cosmicvoyager',
          'https://cosmicvoyager.art',
          'https://api.dicebear.com/7.x/adventurer/svg?seed=CosmicVoyager'
        )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
      `,
      sql`
        INSERT INTO users (id, name, username, email, wallet_address, bio, twitter, instagram, website, avatar_url)
        VALUES (
          'user-3', 
          'Pixel Prophet', 
          'pixelprophet', 
          'pixel@example.com', 
          '0x3456789012345678901234567890123456789012',
          'Retro-futuristic video content with a modern twist.',
          'pixelprophet',
          'pixelprophet',
          'https://pixelprophet.art',
          'https://api.dicebear.com/7.x/adventurer/svg?seed=PixelProphet'
        )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
      `,
      sql`
        INSERT INTO users (id, name, username, email, wallet_address, bio, twitter, instagram, website, avatar_url)
        VALUES (
          'user-4', 
          'Digital Dreamer', 
          'digitaldreamer', 
          'digital@example.com', 
          '0x4567890123456789012345678901234567890123',
          'Exploring the boundaries of digital video and reality.',
          'digitaldreamer',
          'digitaldreamer',
          'https://digitaldreamer.art',
          'https://api.dicebear.com/7.x/adventurer/svg?seed=DigitalDreamer'
        )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
      `,
      sql`
        INSERT INTO users (id, name, username, email, wallet_address, bio, twitter, instagram, website, avatar_url)
        VALUES (
          'user-5', 
          'Crypto Canvas', 
          'cryptocanvas', 
          'crypto@example.com', 
          '0x5678901234567890123456789012345678901234',
          'Merging traditional video techniques with blockchain technology.',
          'cryptocanvas',
          'cryptocanvas',
          'https://cryptocanvas.art',
          'https://api.dicebear.com/7.x/adventurer/svg?seed=CryptoCanvas'
        )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
      `,
    ])

    console.log(`✅ Created ${users.filter((u) => u.length > 0).length} users`)

    // Now let's create sample artworks/videos
    console.log("🎬 Creating sample videos...")

    const artworks = await Promise.all([
      sql`
        INSERT INTO artworks (id, title, description, image, content_url, media_url, creator_id, price)
        VALUES (
          'artwork-1',
          'Neon City Nights',
          'A vibrant cyberpunk cityscape video illuminated by neon lights.',
          '/public/videos/video-1.mp4',
          '/public/videos/video-1.mp4',
          '/public/videos/video-1.mp4',
          'user-1',
          '0.5'
        )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
      `,
      sql`
        INSERT INTO artworks (id, title, description, image, content_url, media_url, creator_id, price)
        VALUES (
          'artwork-2',
          'Digital Dreams',
          'An abstract video representation of digital consciousness.',
          '/public/videos/video-2.mp4',
          '/public/videos/video-2.mp4',
          '/public/videos/video-2.mp4',
          'user-1',
          '0.8'
        )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
      `,
      sql`
        INSERT INTO artworks (id, title, description, image, content_url, media_url, creator_id, price)
        VALUES (
          'artwork-3',
          'Cosmic Journey',
          'Explore the vastness of space through this immersive video experience.',
          '/public/videos/video-3.mp4',
          '/public/videos/video-3.mp4',
          '/public/videos/video-3.mp4',
          'user-2',
          '1.2'
        )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
      `,
      sql`
        INSERT INTO artworks (id, title, description, image, content_url, media_url, creator_id, price)
        VALUES (
          'artwork-4',
          'Galactic Wonders',
          'A video tour through the most beautiful galaxies in our universe.',
          '/public/videos/video-4.mp4',
          '/public/videos/video-4.mp4',
          '/public/videos/video-4.mp4',
          'user-2',
          '0.7'
        )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
      `,
      sql`
        INSERT INTO artworks (id, title, description, image, content_url, media_url, creator_id, price)
        VALUES (
          'artwork-5',
          'Pixel Paradise',
          'A retro-inspired pixel art video landscape with hidden easter eggs.',
          '/public/videos/video-5.mp4',
          '/public/videos/video-5.mp4',
          '/public/videos/video-5.mp4',
          'user-3',
          '0.3'
        )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
      `,
      sql`
        INSERT INTO artworks (id, title, description, image, content_url, media_url, creator_id, price)
        VALUES (
          'artwork-6',
          'Bubble Fish Dreams',
          'A mesmerizing underwater video experience with floating bubble fish.',
          '/public/videos/bubble-fish.mp4',
          '/public/videos/bubble-fish.mp4',
          '/public/videos/bubble-fish.mp4',
          'user-4',
          '0.9'
        )
        ON CONFLICT (id) DO NOTHING
        RETURNING id
      `,
    ])

    console.log(`✅ Created ${artworks.filter((a) => a.length > 0).length} video artworks`)

    // Create follows
    console.log("👥 Creating follow relationships...")
    await Promise.all([
      sql`INSERT INTO follows (follower_id, following_id) VALUES ('user-1', 'user-2') ON CONFLICT DO NOTHING`,
      sql`INSERT INTO follows (follower_id, following_id) VALUES ('user-1', 'user-3') ON CONFLICT DO NOTHING`,
      sql`INSERT INTO follows (follower_id, following_id) VALUES ('user-2', 'user-1') ON CONFLICT DO NOTHING`,
      sql`INSERT INTO follows (follower_id, following_id) VALUES ('user-2', 'user-4') ON CONFLICT DO NOTHING`,
      sql`INSERT INTO follows (follower_id, following_id) VALUES ('user-3', 'user-1') ON CONFLICT DO NOTHING`,
      sql`INSERT INTO follows (follower_id, following_id) VALUES ('user-4', 'user-2') ON CONFLICT DO NOTHING`,
    ])

    // Create likes
    console.log("❤️ Creating likes...")
    await Promise.all([
      sql`INSERT INTO likes (user_id, artwork_id) VALUES ('user-1', 'artwork-3') ON CONFLICT DO NOTHING`,
      sql`INSERT INTO likes (user_id, artwork_id) VALUES ('user-2', 'artwork-1') ON CONFLICT DO NOTHING`,
      sql`INSERT INTO likes (user_id, artwork_id) VALUES ('user-3', 'artwork-2') ON CONFLICT DO NOTHING`,
      sql`INSERT INTO likes (user_id, artwork_id) VALUES ('user-4', 'artwork-1') ON CONFLICT DO NOTHING`,
      sql`INSERT INTO likes (user_id, artwork_id) VALUES ('user-1', 'artwork-6') ON CONFLICT DO NOTHING`,
    ])

    // Create comments
    console.log("💬 Creating comments...")
    await Promise.all([
      sql`
        INSERT INTO comments (id, artwork_id, user_id, username, text, content)
        VALUES (
          'comment-1',
          'artwork-1',
          'user-2',
          'cosmicvoyager',
          'This video is absolutely stunning! The neon colors are perfect.',
          'This video is absolutely stunning! The neon colors are perfect.'
        )
        ON CONFLICT (id) DO NOTHING
      `,
      sql`
        INSERT INTO comments (id, artwork_id, user_id, username, text, content)
        VALUES (
          'comment-2',
          'artwork-3',
          'user-1',
          'neondreams',
          'The cosmic details in this video are incredible. How long did this take you?',
          'The cosmic details in this video are incredible. How long did this take you?'
        )
        ON CONFLICT (id) DO NOTHING
      `,
      sql`
        INSERT INTO comments (id, artwork_id, user_id, username, text, content)
        VALUES (
          'comment-3',
          'artwork-6',
          'user-3',
          'pixelprophet',
          'The bubble fish animation is so mesmerizing! Love the underwater vibes.',
          'The bubble fish animation is so mesmerizing! Love the underwater vibes.'
        )
        ON CONFLICT (id) DO NOTHING
      `,
    ])

    console.log("✅ Database seeding completed successfully!")
    console.log("🎉 Your Video HUB is now ready with sample content!")

    // Final verification
    const userCount = await sql`SELECT COUNT(*) as count FROM users`
    const artworkCount = await sql`SELECT COUNT(*) as count FROM artworks`
    const followCount = await sql`SELECT COUNT(*) as count FROM follows`
    const likeCount = await sql`SELECT COUNT(*) as count FROM likes`
    const commentCount = await sql`SELECT COUNT(*) as count FROM comments`

    console.log("\n📊 Final Database Stats:")
    console.log(`Users: ${userCount[0].count}`)
    console.log(`Videos: ${artworkCount[0].count}`)
    console.log(`Follows: ${followCount[0].count}`)
    console.log(`Likes: ${likeCount[0].count}`)
    console.log(`Comments: ${commentCount[0].count}`)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    throw error
  }
}

// Run the seeding
seedDatabase()
