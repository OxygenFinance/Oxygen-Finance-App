// Main functionality for the homepage
document.addEventListener("DOMContentLoaded", () => {
  const enterGalleryBtn = document.getElementById("enterGalleryBtn")

  // Enter gallery button click handler
  enterGalleryBtn.addEventListener("click", () => {
    window.location.href = "gallery.html"
  })

  // Add animation to hero section
  animateHeroSection()

  // Function to animate hero section elements
  function animateHeroSection() {
    const heroTitle = document.querySelector(".hero-title")
    const heroDescription = document.querySelector(".hero-description")
    const enterButton = document.querySelector(".enter-button")

    // Add animation classes
    setTimeout(() => {
      heroTitle.classList.add("animate-fade-in")
    }, 100)

    setTimeout(() => {
      heroDescription.classList.add("animate-fade-in")
    }, 300)

    setTimeout(() => {
      enterButton.classList.add("animate-fade-in")
    }, 500)
  }

  // Add scroll event listener for header
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".header")
    if (window.scrollY > 50) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  })
})
