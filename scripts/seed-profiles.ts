import { sql } from "@/lib/db"

async function seedProfiles() {
  console.log("Starting to seed profiles...")

  try {
    // Check if we already have users
    const existingUsers = await sql`SELECT COUNT(*) as count FROM users`
    const userCount = Number.parseInt(existingUsers[0].count)

    console.log(`Found ${userCount} existing users`)

    // Only seed if we have fewer than 2 users
    if (userCount >= 2) {
      console.log("Database already has enough users, skipping profile seeding")
      return
    }

    // Sample data for users - only 2 profiles
    const users = [
      {
        name: "Alice Johnson",
        username: "alice_creator",
        bio: "Digital artist specializing in abstract NFTs and immersive experiences",
        wallet_address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      {
        name: "Bob Smith",
        username: "crypto_bob",
        bio: "Blockchain enthusiast and 3D modeler creating unique digital collectibles",
        wallet_address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
      },
    ]

    // Insert users
    for (const user of users) {
      const result = await sql`
        INSERT INTO users (name, username, bio, wallet_address, avatar_url)
        VALUES (${user.name}, ${user.username}, ${user.bio}, ${user.wallet_address}, ${user.avatar_url})
        ON CONFLICT (wallet_address) WHERE wallet_address IS NOT NULL DO NOTHING
        RETURNING id
      `

      if (result.length > 0) {
        console.log(`Created user: ${user.name} with ID: ${result[0].id}`)
      } else {
        console.log(`User with wallet address ${user.wallet_address} already exists, skipped`)
      }
    }

    // Get all users to create artworks and follows
    const allUsers = await sql`SELECT id, name FROM users LIMIT 10`

    if (allUsers.length === 0) {
      console.log("No users found, skipping artwork and follow creation")
      return
    }

    // Sample data for artworks
    const artworkTitles = [
      "Digital Dreamscape",
      "Blockchain Visions",
      "Crypto Sunset",
      "NFT Universe",
      "Virtual Reality",
      "Metaverse Journey",
      "Digital Identity",
      "Tokenized Future",
      "Decentralized Art",
      "Web3 Wonders",
    ]

    // Create artworks for each user
    for (const user of allUsers) {
      // Create 1-3 artworks per user
      const artworkCount = Math.floor(Math.random() * 3) + 1

      for (let i = 0; i < artworkCount; i++) {
        const title = artworkTitles[Math.floor(Math.random() * artworkTitles.length)]
        const result = await sql`
          INSERT INTO artworks (title, description, media_url, thumbnail_url, creator_id)
          VALUES (
            ${title}, 
            ${"A beautiful digital artwork created on the blockchain"}, 
            ${`/placeholder.svg?height=600&width=800&text=${encodeURIComponent(title)}`},
            ${`/placeholder.svg?height=300&width=400&text=${encodeURIComponent(title)}`},
            ${user.id}
          )
          RETURNING id
        `

        if (result.length > 0) {
          console.log(`Created artwork: "${title}" for user: ${user.name} with ID: ${result[0].id}`)
        }
      }
    }

    // Create some follows between users
    for (const follower of allUsers) {
      // Each user follows 1-3 other users
      const followCount = Math.floor(Math.random() * 3) + 1
      const potentialFollowees = allUsers.filter((u) => u.id !== follower.id)

      // Shuffle and take a subset
      const shuffled = [...potentialFollowees].sort(() => 0.5 - Math.random())
      const followees = shuffled.slice(0, Math.min(followCount, shuffled.length))

      for (const followee of followees) {
        try {
          await sql`
            INSERT INTO follows (follower_id, following_id)
            VALUES (${follower.id}, ${followee.id})
            ON CONFLICT (follower_id, following_id) DO NOTHING
          `
          console.log(`User ${follower.name} is now following ${followee.name}`)
        } catch (error) {
          console.error(`Error creating follow relationship: ${error}`)
        }
      }
    }

    console.log("Profile seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding profiles:", error)
  }
}

seedProfiles()
  .catch(console.error)
  .finally(() => {
    console.log("Seed script execution completed")
    process.exit(0)
  })
