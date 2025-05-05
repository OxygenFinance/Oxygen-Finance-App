import { checkDatabaseConnection, getDatabaseTables } from "@/lib/db"

async function testDatabaseConnection() {
  console.log("Testing database connection...")

  try {
    const isConnected = await checkDatabaseConnection()

    if (isConnected) {
      console.log("✅ Successfully connected to the database!")

      const tables = await getDatabaseTables()
      console.log(`Found ${tables.length} tables in the database:`)
      tables.forEach((table) => console.log(`- ${table}`))

      console.log("\nDatabase connection test completed successfully!")
    } else {
      console.error("❌ Failed to connect to the database.")
    }
  } catch (error) {
    console.error("❌ Error testing database connection:", error)
  }
}

testDatabaseConnection().catch((error) => {
  console.error("Unhandled error:", error)
  process.exit(1)
})
