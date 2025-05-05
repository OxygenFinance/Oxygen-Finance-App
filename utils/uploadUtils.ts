// Utility functions for handling file uploads

/**
 * Validates a video file
 * @param file The file to validate
 * @returns An object with validation result and error message if any
 */
export const validateVideoFile = (file: File | null): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: "No file selected" }
  }

  // Check if file is a video
  if (!file.type.startsWith("video/")) {
    return { valid: false, error: "Please select a video file" }
  }

  // Check file size (100MB max)
  if (file.size > 100 * 1024 * 1024) {
    return { valid: false, error: "File size exceeds 100MB limit" }
  }

  return { valid: true }
}

/**
 * Simulates uploading a file to IPFS
 * @param file The file to upload
 * @param onProgress Callback for upload progress updates
 * @returns A promise that resolves to a mock IPFS CID
 */
export const uploadFileToIPFS = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
  // Simulate upload progress
  for (let i = 0; i <= 100; i += 5) {
    if (onProgress) {
      onProgress(i)
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  // Return a mock IPFS CID
  return `QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX${Date.now()}`
}

/**
 * Creates and uploads metadata for an NFT
 * @param metadata The metadata object to upload
 * @returns A promise that resolves to a mock IPFS URI
 */
export const createAndUploadMetadata = async (metadata: any): Promise<string> => {
  // Simulate metadata creation and upload
  await new Promise((resolve) => setTimeout(resolve, 500))
  return `ipfs://QmMetadataXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/${Date.now()}`
}
