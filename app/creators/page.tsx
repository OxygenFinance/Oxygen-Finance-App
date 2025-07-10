export default function CreatorsPage() {
  const sampleCreators = [
    {
      id: "1",
      name: "Video Creator Pro",
      bio: "Professional video creator specializing in Web3 content",
      followers: "25.3K",
      videos: 127,
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "2",
      name: "Crypto Filmmaker",
      bio: "Documentary filmmaker exploring the world of cryptocurrency",
      followers: "18.7K",
      videos: 89,
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "3",
      name: "Tech Reviewer",
      bio: "In-depth reviews of the latest blockchain technology",
      followers: "32.1K",
      videos: 203,
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "4",
      name: "DeFi Educator",
      bio: "Making DeFi accessible through educational content",
      followers: "15.9K",
      videos: 156,
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "5",
      name: "NFT Artist",
      bio: "Digital artist creating unique NFT collections",
      followers: "41.2K",
      videos: 78,
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "6",
      name: "Blockchain Dev",
      bio: "Smart contract developer sharing coding tutorials",
      followers: "28.5K",
      videos: 234,
      avatar: "/placeholder-user.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            Meet Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Creators</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Talented individuals creating amazing content in the Web3 space
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleCreators.map((creator) => (
            <div
              key={creator.id}
              className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="text-center">
                <img
                  src={creator.avatar || "/placeholder.svg?height=100&width=100"}
                  alt={creator.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2">{creator.name}</h3>
                <p className="text-gray-400 mb-4">{creator.bio}</p>

                <div className="flex justify-center space-x-6 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-400">{creator.followers}</div>
                    <div className="text-sm text-gray-500">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-400">{creator.videos}</div>
                    <div className="text-sm text-gray-500">Videos</div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 py-2 rounded-lg font-semibold transition-colors">
                    Follow
                  </button>
                  <button className="flex-1 border border-purple-600 hover:bg-purple-600 py-2 rounded-lg font-semibold transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
