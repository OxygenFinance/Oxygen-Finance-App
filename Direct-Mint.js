"use client"

import { useState } from "react"
import Link from "next/link"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/contexts/WalletContext"
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, checkContractRequiresPayment } from "@/utils/contractConfig"
import { toast } from "react-toastify"

export default function DirectMintV2Page() {
  const { address, connectWallet } = useWallet()
  const [metadataURI, setMetadataURI] = useState("")
  const [price, setPrice] = useState("0.1")
  const [royaltyPercentage, setRoyaltyPercentage] = useState("10")
  const [isMinting, setIsMinting] = useState(false)
  const [txHash, setTxHash] = useState("")
  const [requiresPayment, setRequiresPayment] = useState(false)
  const [mintValue, setMintValue] = useState("0.01")

  const handleMint = async () => {
    if (!address) {
      connectWallet()
      return
    }

    if (!metadataURI) {
      toast.error("Please enter a metadata URI")
      return
    }

    setIsMinting(true)
    setTxHash("")

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer)

      // Convert price to wei
      const priceInWei = ethers.utils.parseEther(price)

      // Check if the contract requires payment
      const needsPayment = await checkContractRequiresPayment()
      setRequiresPayment(needsPayment)

      // Call the mintNFT function on the contract
      let tx
      if (needsPayment) {
        const valueToSend = ethers.utils.parseEther(mintValue)
        tx = await contract.mintNFT(metadataURI, priceInWei, Number.parseInt(royaltyPercentage), { value: valueToSend })
      } else {
        tx = await contract.mintNFT(metadataURI, priceInWei, Number.parseInt(royaltyPercentage))
      }

      setTxHash(tx.hash)

      await tx.wait()

      toast.success("NFT minted successfully!")
    } catch (error: any) {
      console.error("Error minting NFT:", error)
      toast.error(`Failed to mint NFT: ${error.message || "Unknown error"}`)
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-900/20 text-white">
      {/* Header */}
      <header className="bg-black bg-opacity-50 backdrop-blur-md py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Oxygen Finance
            </h1>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/gallery" className="hover:text-pink-400 transition-colors">
              Gallery
            </Link>
            <Link href="/creators" className="hover:text-pink-400 transition-colors">
              Creators
            </Link>
            {!address && (
              <Button
                onClick={connectWallet}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Connect Wallet
              </Button>
            )}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Direct Mint V2</h2>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Mint NFT Directly</CardTitle>
              <CardDescription className="text-gray-400">
                This is a simplified minting page that directly interacts with the contract
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metadataURI">Metadata URI</Label>
                <Input
                  id="metadataURI"
                  value={metadataURI}
                  onChange={(e) => setMetadataURI(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                  placeholder="https://example.com/metadata.json"
                />
                <p className="text-xs text-gray-400">
                  Enter the URI for your NFT metadata. This could be an IPFS URL or any other URL.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">NFT Price (MATIC)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-gray-800 border-gray-700"
                    placeholder="0.1"
                    min="0"
                    step="0.01"
                  />
                </div>
"use client"

import { useState } from "react"
import Link from "next/link"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/contexts/WalletContext"
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, checkContractRequiresPayment } from "@/utils/contractConfig"
import { toast } from "react-toastify"

export default function DirectMintV2Page() {
  const { address, connectWallet } = useWallet()
  const [metadataURI, setMetadataURI] = useState("")
  const [price, setPrice] = useState("0.1")
  const [royaltyPercentage, setRoyaltyPercentage] = useState("10")
  const [isMinting, setIsMinting] = useState(false)
  const [txHash, setTxHash] = useState("")
  const [requiresPayment, setRequiresPayment] = useState(false)
  const [mintValue, setMintValue] = useState("0.01")

  const handleMint = async () => {
    if (!address) {
      connectWallet()
      return
    }

    if (!metadataURI) {
      toast.error("Please enter a metadata URI")
      return
    }

    setIsMinting(true)
    setTxHash("")

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer)

      // Convert price to wei
      const priceInWei = ethers.utils.parseEther(price)

      // Check if the contract requires payment
      const needsPayment = await checkContractRequiresPayment()
      setRequiresPayment(needsPayment)

      // Call the mintNFT function on the contract
      let tx
      if (needsPayment) {
        const valueToSend = ethers.utils.parseEther(mintValue)
        tx = await contract.mintNFT(metadataURI, priceInWei, Number.parseInt(royaltyPercentage), { value: valueToSend })
      } else {
        tx = await contract.mintNFT(metadataURI, priceInWei, Number.parseInt(royaltyPercentage))
      }

      setTxHash(tx.hash)

      await tx.wait()

      toast.success("NFT minted successfully!")
    } catch (error: any) {
      console.error("Error minting NFT:", error)
      toast.error(`Failed to mint NFT: ${error.message || "Unknown error"}`)
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-900/20 text-white">
      {/* Header */}
      <header className="bg-black bg-opacity-50 backdrop-blur-md py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Oxygen Finance
            </h1>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/gallery" className="hover:text-pink-400 transition-colors">
              Gallery
            </Link>
            <Link href="/creators" className="hover:text-pink-400 transition-colors">
              Creators
            </Link>
            {!address && (
              <Button
                onClick={connectWallet}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Connect Wallet
              </Button>
            )}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Direct Mint V2</h2>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Mint NFT Directly</CardTitle>
              <CardDescription className="text-gray-400">
                This is a simplified minting page that directly interacts with the contract
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metadataURI">Metadata URI</Label>
                <Input
                  id="metadataURI"
                  value={metadataURI}
                  onChange={(e) => setMetadataURI(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                  placeholder="https://example.com/metadata.json"
                />
                <p className="text-xs text-gray-400">
                  Enter the URI for your NFT metadata. This could be an IPFS URL or any other URL.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">NFT Price (MATIC)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-gray-800 border-gray-700"
                    placeholder="0.1"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="royalty">Royalty (%)</Label>
                  <Input
                    id="royalty"
                    type="number"
                    value={royaltyPercentage}
                    onChange={(e) => setRoyaltyPercentage(e.target.value)}
                    className="bg-gray-800 border-gray-700"
                    placeholder="10"
                    min="0"
                    max="50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mintValue">Mint Value (MATIC)</Label>
                <Input
                  id="mintValue"
                  type="number"
                  value={mintValue}
                  onChange={(e) => setMintValue(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                  placeholder="0.01"
                  min="0"
                  step="0.01"
                />
                <p className="text-xs text-gray-400">
                  If the contract requires payment to mint, specify the amount to send with the transaction
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                onClick={handleMint}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                disabled={isMinting || !metadataURI}
              >
                {isMinting ? "Minting..." : "Mint NFT"}
              </Button>

              {txHash && (
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">Transaction Hash:</p>
                  <a
                    href={`https://polygonscan.com/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 break-all"
                  >
                    {txHash}
                  </a>
                </div>
              )}
            </CardFooter>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-gray-400 mb-4">Try other minting options:</p>
            <div className="flex justify-center space-x-4">
              <Link href="/mint">
                <Button variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white">
                  Standard Mint
                </Button>
              </Link>
              <Link href="/raw-transaction">
                <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                  Raw Transaction
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
￼Enter
                <div className="space-y-2">
                  <Label htmlFor="royalty">Royalty (%)</Label>
                  <Input
                    id="royalty"
                    type="number"
                    value={royaltyPercentage}
                    onChange={(e) => setRoyaltyPercentage(e.target.value)}
                    className="bg-gray-800 border-gray-700"
                    placeholder="10"
                    min="0"
                    max="50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mintValue">Mint Value (MATIC)</Label>
                <Input
                  id="mintValue"
                  type="number"
                  value={mintValue}
                  onChange={(e) => setMintValue(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                  placeholder="0.01"
                  min="0"
            step="0.01"
                />
                <p className="text-xs text-gray-400">
                  If the contract requires payment to mint, specify the amount to send with the transaction
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                onClick={handleMint}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                disabled={isMinting || !metadataURI}
              >
                {isMinting ? "Minting..." : "Mint NFT"}
              </Button>

              {txHash && (
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">Transaction Hash:</p>
                  <a
                    href={`https://polygonscan.com/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 break-all"
                  >
                    {txHash}
