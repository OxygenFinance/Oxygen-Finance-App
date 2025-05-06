// Client-side Stack configuration
let stackConfig: { projectId: string; publishableKey: string } | null = null

export async function getStackConfig() {
  if (stackConfig) return stackConfig

  try {
    const response = await fetch("/api/stack-config")
    if (!response.ok) {
      throw new Error("Failed to fetch Stack configuration")
    }

    stackConfig = await response.json()
    return stackConfig
  } catch (error) {
    console.error("Error fetching Stack configuration:", error)
    throw error
  }
}
