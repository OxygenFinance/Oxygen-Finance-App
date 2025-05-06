import { execSync } from "child_process"
import path from "path"

// Get the path to the seed-profiles.ts file
const seedProfilesPath = path.resolve(__dirname, "seed-profiles.ts")

console.log("Running seed-profiles.ts...")

try {
  // Execute the seed-profiles.ts file using ts-node
  execSync(`npx tsx ${seedProfilesPath}`, { stdio: "inherit" })
  console.log("Seed profiles completed successfully!")
} catch (error) {
  console.error("Error running seed profiles:", error)
  process.exit(1)
}
