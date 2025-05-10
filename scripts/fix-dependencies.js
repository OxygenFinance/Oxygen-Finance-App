const fs = require("fs")
const path = require("path")

// Check if react-day-picker is installed
try {
  const rdpPackageJsonPath = path.resolve("./node_modules/react-day-picker/package.json")
  if (fs.existsSync(rdpPackageJsonPath)) {
    const rdpPackageJson = JSON.parse(fs.readFileSync(rdpPackageJsonPath, "utf8"))

    // Modify peer dependencies to accept date-fns v4
    if (rdpPackageJson.peerDependencies && rdpPackageJson.peerDependencies["date-fns"]) {
      rdpPackageJson.peerDependencies["date-fns"] = "^2.28.0 || ^3.0.0 || ^4.0.0"
      fs.writeFileSync(rdpPackageJsonPath, JSON.stringify(rdpPackageJson, null, 2))
      console.log("Successfully updated react-day-picker peer dependencies")
    }
  }
} catch (error) {
  console.error("Error updating dependencies:", error)
}
