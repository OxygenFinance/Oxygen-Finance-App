// Deployment troubleshooting script
import { neon } from "@neondatabase/serverless"
import fs from "fs"

async function checkDatabaseConnection() {
  console.log("Checking database connection...")
  try {
    const sql = neon(process.env.DATABASE_URL || "")
    const result = await sql`SELECT 1 as connection_test`
    console.log("Database connection successful:", result)
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

async function checkEnvironmentVariables() {
  console.log("Checking environment variables...")
  const requiredVars = [
    "DATABASE_URL",
    "NEXTAUTH_URL",
    "NEXTAUTH_SECRET",
    "AUTH0_CLIENT_ID",
    "AUTH0_CLIENT_SECRET",
    "AUTH0_ISSUER_BASE_URL",
  ]

  const missing = requiredVars.filter((v) => !process.env[v])
  if (missing.length > 0) {
    console.error("Missing environment variables:", missing)
    return false
  }

  console.log("All required environment variables are present")
  return true
}

async function checkBuildDirectories() {
  console.log("Checking build directories...")
  const dirs = [".next", "public"]

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      console.error(`Directory not found: ${dir}`)
      return false
    }
  }

  console.log("All required directories exist")
  return true
}

async function runDeploymentChecks() {
  console.log("Running deployment checks...")

  const dbCheck = await checkDatabaseConnection()
  const envCheck = await checkEnvironmentVariables()
  const dirCheck = await checkBuildDirectories()

  if (dbCheck && envCheck && dirCheck) {
    console.log("All deployment checks passed!")
    return true
  } else {
    console.error("Some deployment checks failed. Please fix the issues above.")
    return false
  }
}

// Run the checks
runDeploymentChecks().then((success) => {
  if (!success) {
    process.exit(1)
  }
})
