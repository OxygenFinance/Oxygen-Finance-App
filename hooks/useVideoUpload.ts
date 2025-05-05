"use client"

import type React from "react"

import { useState, useRef } from "react"
import { toast } from "react-toastify"
import { validateVideoFile } from "@/utils/uploadUtils"

interface VideoMetadata {
  title: string
  description: string
  price: string
  royaltyPercentage: number
  commentsEnabled: boolean
  isPrivate: boolean
  tags: string
}

export function useVideoUpload(address: string | null) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateVideoFile(file)
    if (!validation.valid) {
      toast.error(validation.error)
      return
    }

    // Clean up previous preview URL if it exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setSelectedFile(file)

    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    toast.success(`File "${file.name}" selected successfully`)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]

      const validation = validateVideoFile(file)
      if (!validation.valid) {
        toast.error(validation.error)
        return
      }

      // Clean up previous preview URL if it exists
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }

      setSelectedFile(file)

      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)

      toast.success(`File "${file.name}" dropped successfully`)
    }
  }

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const uploadAndMint = async (metadata: VideoMetadata) => {
    if (!address) {
      toast.error("Please connect your wallet first")
      return false
    }

    if (!selectedFile) {
      toast.error("Please select a video file")
      return false
    }

    if (!metadata.title) {
      toast.error("Please enter a title")
      return false
    }

    if (!metadata.price) {
      toast.error("Please enter a price")
      return false
    }

    try {
      // Step 1: Upload the video
      setIsUploading(true)
      toast.info("Uploading video...")

      // Create a video URL that will actually work
      const videoUrl = URL.createObjectURL(selectedFile)

      // For demo purposes, we'll use guaranteed working fallback videos
      const fallbackVideoUrls = [
        "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
      ]

      // Choose a random fallback
      const fallbackVideoUrl = fallbackVideoUrls[Math.floor(Math.random() * fallbackVideoUrls.length)]

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(progress)
        await new Promise((resolve) => setTimeout(resolve, 300))
      }

      toast.success("Video uploaded successfully!")
      setIsUploading(false)

      // Step 2: Create NFT metadata
      setIsMinting(true)
      toast.info("Creating token-gated NFT...")

      // Simulate metadata creation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a thumbnail from the video or use a placeholder
      const thumbnailUrl = "/placeholder.svg?height=400&width=600"
      try {
        // In a real app, you'd generate a thumbnail from the video
        // For now, we'll just use the placeholder
      } catch (error) {
        console.error("Error generating thumbnail:", error)
      }

      // Step 3: Mint the NFT (simulated)
      toast.info("Minting NFT on blockchain...")

      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate a mock transaction hash
      const txHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

      // Get user info
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const userId = user.id || address

      // Save to localStorage for demo purposes
      const newNFT = {
        id: Date.now().toString(),
        title: metadata.title,
        description: metadata.description,
        image: thumbnailUrl,
        price: metadata.price,
        creator: address,
        creatorId: userId,
        type: "token_gated_video",
        date: new Date().toLocaleDateString(),
        commentsEnabled: metadata.commentsEnabled,
        isPrivate: metadata.isPrivate,
        txHash: txHash,
        contentId: Date.now().toString(),
        contentUrl: fallbackVideoUrl, // Use the fallback URL for guaranteed playback
        originalUrl: videoUrl, // Store the original URL too
      }

      // Get existing NFTs or initialize empty array
      const savedNFTs = localStorage.getItem(`${userId}-nfts`)
      const nfts = savedNFTs ? JSON.parse(savedNFTs) : []

      // Add new NFT to array
      nfts.push(newNFT)

      // Save updated array
      localStorage.setItem(`${userId}-nfts`, JSON.stringify(nfts))

      // Add the creator to the creators list for discovery
      const savedCreators = localStorage.getItem("all-creators") || "[]"
      const creators = JSON.parse(savedCreators)

      // Check if creator already exists
      const existingCreatorIndex = creators.findIndex((c: any) => c.address === address)

      if (existingCreatorIndex >= 0) {
        // Update existing creator
        creators[existingCreatorIndex].nftCount += 1
      } else {
        // Add new creator
        creators.push({
          address: address,
          userId: userId,
          username: user.name || "Creator" + address.substring(0, 4),
          nftCount: 1,
          joinDate: new Date().toISOString().split("T")[0],
          isVerified: false,
        })
      }

      localStorage.setItem("all-creators", JSON.stringify(creators))

      toast.success("Token-gated NFT created successfully!")

      // Dispatch a custom event to notify the Creators page to refresh
      window.dispatchEvent(new Event("creators-updated"))

      // Clean up
      handleRemoveFile()
      return true
    } catch (error: any) {
      console.error("Error minting NFT:", error)
      toast.error(`Failed to mint NFT: ${error.message || "Unknown error"}`)
      return false
    } finally {
      setIsUploading(false)
      setIsMinting(false)
      setUploadProgress(0)
    }
  }

  return {
    selectedFile,
    previewUrl,
    isUploading,
    isMinting,
    uploadProgress,
    fileInputRef,
    handleFileChange,
    handleDragOver,
    handleDrop,
    handleRemoveFile,
    uploadAndMint,
  }
}
