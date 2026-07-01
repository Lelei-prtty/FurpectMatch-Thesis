export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                🐾
              </div>
              <span className="text-xl font-bold text-white">PawMatch</span>
            </div>
            <p className="text-sm text-gray-400">
              Connecting pets with people to create happy, lifelong matches.
            </p>
          </div>

          {/* For Adopters */}
          <div>
            <h4 className="font-semibold text-white mb-4">For Adopters</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Browse Pets</a></li>
              <li><a href="#" className="hover:text-white transition">How It Works</a></li>
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition">Support</a></li>
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h4 className="font-semibold text-white mb-4">For Providers</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Register</a></li>
              <li><a href="#" className="hover:text-white transition">Partner Program</a></li>
              <li><a href="#" className="hover:text-white transition">Resources</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-sm text-gray-500">
            &copy; 2024 PawMatch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
