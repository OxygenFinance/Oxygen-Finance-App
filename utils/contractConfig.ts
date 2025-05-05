import { ethers } from "ethers"

// Update the contract ABI with the exact ABI provided by the user
export const NFT_CONTRACT_ADDRESS = "0xCd9d4F95f4e7ecad41c27eEC4E8171Fd68619366"

export const NFT_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "metadataURI",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "royaltyPercentage",
        type: "uint256",
      },
    ],
    name: "mintNFT",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getNFTDetails",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "royaltyPercentage",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "string",
            name: "metadataURI",
            type: "string",
          },
        ],
        internalType: "struct OxygenFinanceNFT.NFTDetails",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]

// Add this helper function to check if the contract requires payment
export async function checkContractRequiresPayment() {
  try {
    const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com")
    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, provider)

    // Check if mintNFT is payable by looking at its stateMutability
    const mintNFTAbi = NFT_CONTRACT_ABI.find((item) => item.name === "mintNFT" && item.type === "function")

    return mintNFTAbi?.stateMutability === "payable"
  } catch (error) {
    console.error("Error checking if contract requires payment:", error)
    return false
  }
}

// Add a direct minting function that can be used across the app
export async function mintVideoNFT(metadataURI: string, price: string, royaltyPercentage: number) {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("Please install MetaMask to mint NFTs")
  }

  try {
    // Request account access if needed
    await window.ethereum.request({ method: "eth_requestAccounts" })

    // Create provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()

    // Create contract instance
    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer)

    // Convert price to wei
    const priceInWei = ethers.parseEther(price)

    console.log("Minting NFT with params:", {
      metadataURI,
      price: priceInWei.toString(),
      royaltyPercentage,
    })

    // Call the mintNFT function
    const tx = await contract.mintNFT(
      metadataURI,
      priceInWei,
      royaltyPercentage,
      { value: ethers.parseEther("0.01") }, // Send 0.01 MATIC if needed
    )

    console.log("Transaction submitted:", tx.hash)

    // Wait for transaction to be mined
    const receipt = await tx.wait()
    console.log("Transaction confirmed:", receipt)

    return {
      success: true,
      txHash: tx.hash,
      receipt,
    }
  } catch (error: any) {
    console.error("Error minting NFT:", error)
    throw error
  }
}
