"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ethers } from "ethers"
import { Menu, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from "@/utils/contractConfig"
import { useWallet } from "@/contexts/WalletContext"

interface NFTDetails {
  price: ethers.BigNumber
  royaltyPercentage: ethers.BigNumber
  creator: string
  metadataURI: string
}

export default function CollectionsPage() {
  const { address, connectWallet } = useWallet()
  const [collections, setCollections] = useState<NFTDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCollections = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, provider)

          // For simplicity, we'll fetch the first 20 NFTs
          // In a real application, you'd implement pagination
          const nftPromises = []
          for (let i = 0; i < 20; i++) {
            nftPromises.push(contract.getNFTDetails(i).catch(() => null))
          }

          const nftDetails = await Promise.all(nftPromises)
          const validNFTs = nftDetails.filter((nft) => nft !== null)

          setCollections(validNFTs)
          setIsLoading(false)
        } catch (error) {
          console.error("Failed to fetch collections:", error)
          setIsLoading(false)
        }
      } else {
        console.log("Please install MetaMask!")
        setIsLoading(false)
      }
    }

    fetchCollections()
  }, [])

  const purchaseNFT = async (tokenId: number, price: ethers.BigNumber) => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer)

        const tx = await contract.purchaseNFT(tokenId, { value: price })
        await tx.wait()

        alert("NFT purchased successfully!")
      } catch (error) {
        console.error("Failed to purchase NFT:", error)
        alert("Failed to purchase NFT. Please try again.")
      }
    } else {
      alert("Please install MetaMask to purchase NFTs!")
    }
  }

  return (
    <div className="min-h-screen text-white">
      <header className="bg-gray-900 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Menu className="mr-4 cursor-pointer" />
            <Link href="/">
              <h1 className="text-2xl font-bold">Oxygen Finance</h1>
            </Link>
          </div>
          <div className="flex-1 mx-4">
            <Input type="text" placeholder="Search collections" className="w-full max-w-md bg-gray-800 text-white" />
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="cursor-pointer" />
            {address ? (
              <Link href="/profile">
                <Button variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white">
                  Profile
                </Button>
              </Link>
            ) : (
              <Button
                onClick={connectWallet}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Featured Collections</h2>
        {isLoading ? (
          <p>Loading collections...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {collections.map((nft, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gray-700">
                  <img
                    src={nft.metadataURI || "/placeholder.svg"}
                    alt={`NFT ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">NFT #{index + 1}</h3>
                  <p className="text-sm text-gray-400">
                    Creator: {nft.creator.slice(0, 6)}...{nft.creator.slice(-4)}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">Price: {ethers.utils.formatEther(nft.price)} MATIC</p>
                  <p className="text-sm text-gray-400">Royalty: {nft.royaltyPercentage.toString()}%</p>
                  <Button
                    onClick={() => purchaseNFT(index, nft.price)}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                  >
                    Purchase
                  </Button>

                  {/* Add comments button */}
                  <Button
                    onClick={() => (window.location.href = `/video/${index}`)}
                    className="w-full mt-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    View & Comment
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
