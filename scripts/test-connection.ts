import { neon } from "@neondatabase/serverless"

async function testConnection() {
  console.log("Testing database connection...")

  // Use the updated connection string
  const connectionString =
    "postgresql://OXG_owner:npg_59dxGQDWPvzp@ep-tiny-rain-a5uriang-pooler.us-east-2.aws.neon.tech/OXG?sslmode=require"

  // Mask the password in the log
  const maskedConnectionString = connectionString.replace(/:[^:@]+@/, ":****@")
  console.log(`Using connection string: ${maskedConnectionString}`)

  try {
    // Initialize the SQL client
    const sql = neon(connectionString)

    // Test the connection
    const result = await sql`SELECT current_timestamp as time, current_database() as database`

    console.log("✅ Successfully connected to the database!")
    console.log(`Current time from database: ${result[0].time}`)
    console.log(`Connected to database: ${result[0].database}`)

    // Get table information
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    if (tables.length > 0) {
      console.log(`\nFound ${tables.length} tables in the database:`)
      tables.forEach((table, index) => {
        console.log(`${index + 1}. ${table.table_name}`)
      })
    } else {
      console.log("\nNo tables found in the database.")
    }
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error)
  }
}

testConnection().catch(console.error)
