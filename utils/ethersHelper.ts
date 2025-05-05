// This file provides compatibility with ethers v6
import { ethers } from "ethers"

// Helper functions for ethers operations
export const getProvider = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    // For browser environments with MetaMask
    try {
      return new ethers.BrowserProvider(window.ethereum)
    } catch (error) {
      console.error("Error creating browser provider:", error)
      // Fall through to the fallback
    }
  }

  // Use a mock provider for development/testing
  return {
    getBalance: async () => {
      return ethers.parseEther("10.5") // Mock 10.5 MATIC
    },
    send: async (method: string, params: any[]) => {
      if (method === "eth_accounts") {
        return [] // Mock empty accounts array
      }
      if (method === "eth_requestAccounts") {
        return ["0x71CB05EE1b1F506fF321Da3dac38f25c0c9ce6E1"] // Mock account
      }
      return null
    },
    getNetwork: async () => {
      return { chainId: 137n } // Mock Polygon network
    },
  }
}

export const getSigner = async () => {
  const provider = getProvider()
  if (provider instanceof ethers.BrowserProvider) {
    return provider.getSigner()
  }
  // Return a mock signer for development
  return new ethers.Wallet(ethers.randomBytes(32))
}

export const formatEther = (value: bigint | string) => {
  return ethers.formatEther(value)
}

export const parseEther = (value: string) => {
  return ethers.parseEther(value)
}

export const getContract = (address: string, abi: any, signerOrProvider: any) => {
  return new ethers.Contract(address, abi, signerOrProvider)
}

export const isAddress = (address: string) => {
  return ethers.isAddress(address)
}

export const getBalance = async (address: string) => {
  const provider = getProvider()
  if (provider instanceof ethers.BrowserProvider) {
    const balance = await provider.getBalance(address)
    return formatEther(balance)
  }
  return "10.5" // Mock balance for development
}

export const createWallet = () => {
  return ethers.Wallet.createRandom()
}

export const hashMessage = (message: string) => {
  return ethers.hashMessage(message)
}
