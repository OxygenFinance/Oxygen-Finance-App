import { exec } from "child_process"

// Run the seed script with ts-node
exec("npx ts-node -r tsconfig-paths/register scripts/seed-database.ts", (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`)
    return
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`)
    return
  }
  console.log(`Stdout: ${stdout}`)
})
