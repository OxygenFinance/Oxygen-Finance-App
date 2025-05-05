// Upload page functionality
document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm")
  const submitBtn = document.getElementById("submitBtn")
  const fileInput = document.getElementById("file")

  // Check if wallet is connected
  checkWalletConnection()

  // Form submit handler
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    // Check if wallet is connected
    const address = localStorage.getItem("walletAddress")
    if (!address) {
      showToast("Please connect your wallet first", "error")
      return
    }

    // Get form values
    const title = document.getElementById("title").value
    const description = document.getElementById("description").value
    const price = document.getElementById("price").value
    const supply = document.getElementById("supply").value
    const royalty = document.getElementById("royalty").value
    const file = fileInput.files[0]

    // Validate form
    if (!title || !description || !price || !file) {
      showToast("Please fill in all required fields", "error")
      return
    }

    // Disable submit button
    submitBtn.disabled = true
    submitBtn.textContent = "Uploading and Minting..."

    try {
      // Simulate file upload
      showToast("Uploading video...", "info")
      const ipfsCID = await simulateUpload(file)

      // Simulate metadata creation
      showToast("Creating metadata...", "info")
      const metadataURI = await simulateMetadataCreation(title, description, ipfsCID)

      // Simulate minting NFT
      showToast("Minting NFT...", "info")
      const txHash = await simulateMinting(metadataURI, price, royalty, supply)

      // Save NFT to localStorage
      saveNFT(address, title, description, price, txHash)

      // Show success message
      showToast("NFT minted successfully!", "success")

      // Reset form
      uploadForm.reset()
    } catch (error) {
      console.error("Error minting NFT:", error)
      showToast(`Failed to mint NFT: ${error.message || "Unknown error"}`, "error")
    } finally {
      // Re-enable submit button
      submitBtn.disabled = false
      submitBtn.textContent = "Upload and Mint NFT"
    }
  })

  // Function to check if wallet is connected
  function checkWalletConnection() {
    const address = localStorage.getItem("walletAddress")
    const profileBtn = document.getElementById("profileBtn")
    const connectWalletBtn = document.getElementById("connectWalletBtn")
    const disconnectWalletBtn = document.getElementById("disconnectWalletBtn")

    if (address) {
      connectWalletBtn.classList.add("hidden")
      disconnectWalletBtn.classList.remove("hidden")
      disconnectWalletBtn.textContent = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
      profileBtn.classList.remove("hidden")
    } else {
      connectWalletBtn.classList.remove("hidden")
      disconnectWalletBtn.classList.add("hidden")
      profileBtn.classList.add("hidden")
    }
  }

  // Function to simulate file upload
  async function simulateUpload(file) {
    // In a real app, you would upload the file to IPFS
    // For this demo, we'll simulate the upload with a delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return `QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX${Date.now()}`
  }

  // Function to simulate metadata creation
  async function simulateMetadataCreation(title, description, ipfsCID) {
    // In a real app, you would create and upload metadata to IPFS
    // For this demo, we'll simulate the process with a delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return `ipfs://QmMetadataXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/${Date.now()}`
  }

  // Function to simulate minting NFT
  async function simulateMinting(metadataURI, price, royalty, supply) {
    // In a real app, you would interact with the blockchain
    // For this demo, we'll simulate the process with a delay
    await new Promise((resolve) => setTimeout(resolve, 3000))
    return `0x${Math.random().toString(16).substring(2, 42)}`
  }

  // Function to save NFT to localStorage
  function saveNFT(address, title, description, price, txHash) {
    const newNFT = {
      id: Date.now().toString(),
      title: title,
      description: description,
      image: "/placeholder.svg",
      price: price,
      creator: address,
      type: "video",
      date: new Date().toLocaleDateString(),
      txHash: txHash,
    }

    const savedNFTs = localStorage.getItem(`${address}-nfts`)
    const nfts = savedNFTs ? JSON.parse(savedNFTs) : []
    nfts.push(newNFT)
    localStorage.setItem(`${address}-nfts`, JSON.stringify(nfts))
  }

  // Function to show toast notification
  function showToast(message, type) {
    const toastContainer = document.getElementById("toast-container")
    const toast = document.createElement("div")
    toast.className = `toast toast-${type}`
    toast.textContent = message
    toastContainer.appendChild(toast)

    setTimeout(() => {
      toast.classList.add("show")
    }, 100)

    setTimeout(() => {
      toast.classList.remove("show")
      setTimeout(() => {
        toastContainer.removeChild(toast)
      }, 300)
    }, 3000)
  }
})
