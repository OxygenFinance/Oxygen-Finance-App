import { createUser, createArtwork, followUser, likeArtwork, createComment } from "@/lib/storage"
import { v4 as uuidv4 } from "uuid"

async function seedDatabase() {
  console.log("Seeding database...")

  // Create users
  const users = [
    {
      id: uuidv4(),
      name: "Neon Dreams",
      username: "neondreams",
      email: "neon@example.com",
      wallet_address: "0x1234567890123456789012345678901234567890",
      bio: "Digital artist specializing in cyberpunk and futuristic cityscapes.",
      twitter: "neondreams",
      instagram: "neondreams",
      website: "https://neondreams.art",
    },
    {
      id: uuidv4(),
      name: "Cosmic Voyager",
      username: "cosmicvoyager",
      email: "cosmic@example.com",
      wallet_address: "0x2345678901234567890123456789012345678901",
      bio: "Creating ethereal space-themed digital paintings and animations.",
      twitter: "cosmicvoyager",
      instagram: "cosmicvoyager",
      website: "https://cosmicvoyager.art",
    },
    {
      id: uuidv4(),
      name: "Pixel Prophet",
      username: "pixelprophet",
      email: "pixel@example.com",
      wallet_address: "0x3456789012345678901234567890123456789012",
      bio: "Retro-futuristic pixel art with a modern twist.",
      twitter: "pixelprophet",
      instagram: "pixelprophet",
      website: "https://pixelprophet.art",
    },
    {
      id: uuidv4(),
      name: "Digital Dreamer",
      username: "digitaldreamer",
      email: "digital@example.com",
      wallet_address: "0x4567890123456789012345678901234567890123",
      bio: "Exploring the boundaries of digital art and reality.",
      twitter: "digitaldreamer",
      instagram: "digitaldreamer",
      website: "https://digitaldreamer.art",
    },
    {
      id: uuidv4(),
      name: "Crypto Canvas",
      username: "cryptocanvas",
      email: "crypto@example.com",
      wallet_address: "0x5678901234567890123456789012345678901234",
      bio: "Merging traditional art techniques with blockchain technology.",
      twitter: "cryptocanvas",
      instagram: "cryptocanvas",
      website: "https://cryptocanvas.art",
    },
  ]

  const createdUsers = []
  for (const user of users) {
    console.log(`Creating user: ${user.username}`)
    const createdUser = await createUser(user)
    createdUsers.push(createdUser)
  }

  // Create artworks
  const artworks = [
    {
      id: uuidv4(),
      title: "Neon City Nights",
      description: "A vibrant cyberpunk cityscape illuminated by neon lights.",
      image: "/placeholder.svg?height=600&width=800&text=Neon+City+Nights",
      content_url: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
      creator_id: createdUsers[0].id,
      price: "0.5",
    },
    {
      id: uuidv4(),
      title: "Digital Dreams",
      description: "An abstract representation of the digital consciousness.",
      image: "/placeholder.svg?height=600&width=800&text=Digital+Dreams",
      content_url: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
      creator_id: createdUsers[0].id,
      price: "0.8",
    },
    {
      id: uuidv4(),
      title: "Cosmic Journey",
      description: "Explore the vastness of space through this immersive experience.",
      image: "/placeholder.svg?height=600&width=800&text=Cosmic+Journey",
      content_url: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
      creator_id: createdUsers[1].id,
      price: "1.2",
    },
    {
      id: uuidv4(),
      title: "Galactic Wonders",
      description: "A tour through the most beautiful galaxies in our universe.",
      image: "/placeholder.svg?height=600&width=800&text=Galactic+Wonders",
      content_url: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
      creator_id: createdUsers[1].id,
      price: "0.7",
    },
    {
      id: uuidv4(),
      title: "Pixel Paradise",
      description: "A retro-inspired pixel art landscape with hidden easter eggs.",
      image: "/placeholder.svg?height=600&width=800&text=Pixel+Paradise",
      content_url: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
      creator_id: createdUsers[2].id,
      price: "0.3",
    },
    {
      id: uuidv4(),
      title: "8-Bit Adventures",
      description: "A nostalgic journey through gaming history in pixel art form.",
      image: "/placeholder.svg?height=600&width=800&text=8-Bit+Adventures",
      content_url: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
      creator_id: createdUsers[2].id,
      price: "0.4",
    },
    {
      id: uuidv4(),
      title: "Dream Sequence",
      description: "A surreal journey through the subconscious mind.",
      image: "/placeholder.svg?height=600&width=800&text=Dream+Sequence",
      content_url: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
      creator_id: createdUsers[3].id,
      price: "0.9",
    },
    {
      id: uuidv4(),
      title: "Digital Illusions",
      description: "Optical illusions created entirely in the digital realm.",
      image: "/placeholder.svg?height=600&width=800&text=Digital+Illusions",
      content_url: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
      creator_id: createdUsers[3].id,
      price: "0.6",
    },
    {
      id: uuidv4(),
      title: "Blockchain Visions",
      description: "A visual representation of blockchain technology and its potential.",
      image: "/placeholder.svg?height=600&width=800&text=Blockchain+Visions",
      content_url: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
      creator_id: createdUsers[4].id,
      price: "1.5",
    },
    {
      id: uuidv4(),
      title: "Crypto Renaissance",
      description: "A fusion of classical art styles with modern crypto themes.",
      image: "/placeholder.svg?height=600&width=800&text=Crypto+Renaissance",
      content_url: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
      creator_id: createdUsers[4].id,
      price: "1.0",
    },
  ]

  const createdArtworks = []
  for (const artwork of artworks) {
    console.log(`Creating artwork: ${artwork.title}`)
    const createdArtwork = await createArtwork(artwork)
    createdArtworks.push(createdArtwork)
  }

  // Create follows
  console.log("Creating follows...")
  await followUser(createdUsers[0].id, createdUsers[1].id)
  await followUser(createdUsers[0].id, createdUsers[2].id)
  await followUser(createdUsers[1].id, createdUsers[0].id)
  await followUser(createdUsers[1].id, createdUsers[3].id)
  await followUser(createdUsers[2].id, createdUsers[0].id)
  await followUser(createdUsers[2].id, createdUsers[4].id)
  await followUser(createdUsers[3].id, createdUsers[1].id)
  await followUser(createdUsers[3].id, createdUsers[4].id)
  await followUser(createdUsers[4].id, createdUsers[0].id)
  await followUser(createdUsers[4].id, createdUsers[2].id)

  // Create likes
  console.log("Creating likes...")
  await likeArtwork(createdUsers[0].id, createdArtworks[2].id)
  await likeArtwork(createdUsers[0].id, createdArtworks[4].id)
  await likeArtwork(createdUsers[0].id, createdArtworks[8].id)
  await likeArtwork(createdUsers[1].id, createdArtworks[0].id)
  await likeArtwork(createdUsers[1].id, createdArtworks[5].id)
  await likeArtwork(createdUsers[1].id, createdArtworks[7].id)
  await likeArtwork(createdUsers[2].id, createdArtworks[1].id)
  await likeArtwork(createdUsers[2].id, createdArtworks[3].id)
  await likeArtwork(createdUsers[2].id, createdArtworks[9].id)
  await likeArtwork(createdUsers[3].id, createdArtworks[0].id)
  await likeArtwork(createdUsers[3].id, createdArtworks[2].id)
  await likeArtwork(createdUsers[3].id, createdArtworks[6].id)
  await likeArtwork(createdUsers[4].id, createdArtworks[1].id)
  await likeArtwork(createdUsers[4].id, createdArtworks[4].id)
  await likeArtwork(createdUsers[4].id, createdArtworks[7].id)

  // Create comments
  console.log("Creating comments...")
  await createComment({
    id: uuidv4(),
    artwork_id: createdArtworks[0].id,
    user_id: createdUsers[1].id,
    username: createdUsers[1].username,
    text: "This is absolutely stunning! The neon colors are perfect.",
  })

  await createComment({
    id: uuidv4(),
    artwork_id: createdArtworks[0].id,
    user_id: createdUsers[3].id,
    username: createdUsers[3].username,
    text: "I love the atmosphere you created here. Very immersive!",
  })

  await createComment({
    id: uuidv4(),
    artwork_id: createdArtworks[2].id,
    user_id: createdUsers[0].id,
    username: createdUsers[0].username,
    text: "The cosmic details are incredible. How long did this take you?",
  })

  await createComment({
    id: uuidv4(),
    artwork_id: createdArtworks[2].id,
    user_id: createdUsers[3].id,
    username: createdUsers[3].username,
    text: "This makes me feel like I'm floating through space. Amazing work!",
  })

  await createComment({
    id: uuidv4(),
    artwork_id: createdArtworks[4].id,
    user_id: createdUsers[0].id,
    username: createdUsers[0].username,
    text: "The pixel art style is so nostalgic. Great execution!",
  })

  await createComment({
    id: uuidv4(),
    artwork_id: createdArtworks[4].id,
    user_id: createdUsers[4].id,
    username: createdUsers[4].username,
    text: "I found all the easter eggs! So clever how you hid them.",
  })

  await createComment({
    id: uuidv4(),
    artwork_id: createdArtworks[6].id,
    user_id: createdUsers[2].id,
    username: createdUsers[2].username,
    text: "This dream sequence really captures that surreal feeling. Well done!",
  })

  await createComment({
    id: uuidv4(),
    artwork_id: createdArtworks[8].id,
    user_id: createdUsers[0].id,
    username: createdUsers[0].username,
    text: "Your visualization of blockchain is so creative and accurate!",
  })

  console.log("Database seeding completed successfully!")
}

seedDatabase().catch((error) => {
  console.error("Error seeding database:", error)
  process.exit(1)
})
