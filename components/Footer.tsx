import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-black py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <img src="/logo.png" alt="Oxygen Finance Logo" className="h-10 mr-3" />
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Oxygen Finance
              </h3>
            </div>
            <p className="text-gray-400 mt-2">The future of digital art galleries</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/gallery" className="text-gray-400 hover:text-white transition-colors">
              Gallery
            </Link>
            <Link href="/creators" className="text-gray-400 hover:text-white transition-colors">
              Creators
            </Link>
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center mt-8 space-x-6">
          <a
            href="https://X.com/Oxy_GenLabs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-twitter"
            >
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
            </svg>
          </a>
          <a
            href="https://t.me/Oxygen_finance"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-send"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </a>
          <a
            href="https://discord.gg/fBe5pzMx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="12" r="1" />
              <circle cx="15" cy="12" r="1" />
              <path d="M7.5 7.5c3.5-1 5.5-1 9 0" />
              <path d="M7.5 16.5c3.5 1 5.5 1 9 0" />
              <path d="M15.5 17c0 1 1.5 3 2 3 1.5 0 2.833-1.667 3.5-3 .667-1.667.5-5.833 0-7.5-.5-1.667-1.5-4.5-7-4.5s-6.5 2.833-7 4.5c-.5 1.667-.667 5.833 0 7.5.667 1.333 2 3 3.5 3 .5 0 2-2 2-3" />
            </svg>
          </a>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Oxygen Finance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
