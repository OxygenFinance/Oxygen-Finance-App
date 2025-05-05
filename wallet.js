// Wallet connection functionality
document.addEventListener("DOMContentLoaded", () => {
  const connectWalletBtn = document.getElementById("connectWalletBtn")
  const disconnectWalletBtn = document.getElementById("disconnectWalletBtn")
  const profileBtn = document.getElementById("profileBtn")

  // Check if wallet is already connected
  checkWalletConnection()

  // Connect wallet button click handler
  connectWalletBtn.addEventListener("click", connectWallet)

  // Disconnect wallet button click handler
  disconnectWalletBtn.addEventListener("click", disconnectWallet)

  // Profile button click handler
  profileBtn.addEventListener("click", () => {
    window.location.href = "profile.html"
  })

  // Function to check if wallet is already connected
  function checkWalletConnection() {
    const address = localStorage.getItem("walletAddress")
    if (address) {
      showConnectedState(address)
    }
  }

  // Function to connect wallet
  async function connectWallet() {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== "undefined") {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        const address = accounts[0]

        // Save address to localStorage
        localStorage.setItem("walletAddress", address)

        // Update UI
        showConnectedState(address)

        // Show success message
        showToast("Wallet connected successfully!", "success")
      } catch (error) {
        console.error("Error connecting wallet:", error)
        showToast("Failed to connect wallet. Please try again.", "error")
      }
    } else {
      showToast("Please install MetaMask to connect your wallet!", "error")
    }
  }

  // Function to disconnect wallet
  function disconnectWallet() {
    // Remove address from localStorage
    localStorage.removeItem("walletAddress")

    // Update UI
    showDisconnectedState()

    // Show success message
    showToast("Wallet disconnected!", "success")
  }

  // Function to update UI for connected state
  function showConnectedState(address) {
    connectWalletBtn.classList.add("hidden")
    disconnectWalletBtn.classList.remove("hidden")
    disconnectWalletBtn.textContent = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    profileBtn.classList.remove("hidden")
  }

  // Function to update UI for disconnected state
  function showDisconnectedState() {
    connectWalletBtn.classList.remove("hidden")
    disconnectWalletBtn.classList.add("hidden")
    profileBtn.classList.add("hidden")
  }

  // Simple toast notification function
  function showToast(message, type) {
    const toast = document.createElement("div")
    toast.className = `toast toast-${type}`
    toast.textContent = message
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.classList.add("show")
    }, 100)

    setTimeout(() => {
      toast.classList.remove("show")
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 300)
    }, 3000)
  }
})
