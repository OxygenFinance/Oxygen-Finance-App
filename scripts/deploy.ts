// Deployment helper script
import { execSync } from "child_process"
import fs from "fs"

function runCommand(command: string) {
  try {
    console.log(`Running: ${command}`)
    execSync(command, { stdio: "inherit" })
    return true
  } catch (error) {
    console.error(`Command failed: ${command}`)
    console.error(error)
    return false
  }
}

async function deploy() {
  console.log("Starting deployment preparation...")

  // Check if .env.local exists
  if (!fs.existsSync(".env.local") && !fs.existsSync(".env")) {
    console.error("No .env.local or .env file found. Please create one with your environment variables.")
    return false
  }

  // Clean up
  console.log("Cleaning up...")
  runCommand("rm -rf .next")

  // Install dependencies
  console.log("Installing dependencies...")
  if (!runCommand("npm install")) {
    return false
  }

  // Build the project
  console.log("Building the project...")
  if (!runCommand("npm run build")) {
    return false
  }

  // Run deployment checks
  console.log("Running deployment checks...")
  if (!runCommand("npx ts-node scripts/deployment-check.ts")) {
    return false
  }

  console.log("Deployment preparation completed successfully!")
  console.log("You can now deploy your project to Vercel with:")
  console.log("  vercel --prod")

  return true
}

deploy().then((success) => {
  if (!success) {
    process.exit(1)
  }
})
