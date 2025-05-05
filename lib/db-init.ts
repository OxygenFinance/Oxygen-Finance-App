import { sql } from "@/lib/db"

export async function initializeDatabase() {
  try {
    // Create users table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        username TEXT,
        email TEXT,
        wallet_address TEXT UNIQUE,
        profile_image TEXT,
        bio TEXT,
        twitter TEXT,
        instagram TEXT,
        website TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Create accounts table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id TEXT NOT NULL,
        provider TEXT NOT NULL,
        provider_account_id TEXT NOT NULL,
        type TEXT,
        access_token TEXT,
        token_type TEXT,
        expires_at BIGINT,
        refresh_token TEXT,
        id_token TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(provider, provider_account_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `

    // Create sessions table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        expires TIMESTAMP WITH TIME ZONE NOT NULL,
        session_token TEXT UNIQUE NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `

    // Create follows table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS follows (
        follower_id TEXT NOT NULL,
        following_id TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (follower_id, following_id),
        FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `

    // Create artworks table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS artworks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        image TEXT,
        content_url TEXT,
        creator_id TEXT NOT NULL,
        price TEXT,
        likes INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `

    // Create likes table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS likes (
        user_id TEXT NOT NULL,
        artwork_id TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, artwork_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
      );
    `

    // Create comments table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        artwork_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        username TEXT NOT NULL,
        profile_image TEXT,
        text TEXT NOT NULL,
        likes INTEGER DEFAULT 0,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `

    console.log("Database initialized successfully")
    return { success: true }
  } catch (error) {
    console.error("Error initializing database:", error)
    return { success: false, error }
  }
}
