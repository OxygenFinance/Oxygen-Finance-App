// Import the correct function from js-sha3
import { keccak256 } from "js-sha3"
import { ethers } from "ethers"

// Export the keccak256 function for use in other files
export { keccak256 }

// Function to hash a message using ethers.js
export function hashMessage(message: string): string {
  return ethers.keccak256(ethers.toUtf8Bytes(message))
}

// Function to verify a signature
export function verifySignature(message: string, signature: string, address: string): boolean {
  const messageHash = ethers.hashMessage(message)
  const recoveredAddress = ethers.recoverAddress(messageHash, signature)
  return recoveredAddress.toLowerCase() === address.toLowerCase()
}
