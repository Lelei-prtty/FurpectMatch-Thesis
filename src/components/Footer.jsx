export default function Footer() {
  return (
    <footer className="bg-[#683B0D] text-white px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold text-white">Furpect Match</span>
            </div>
            <p className="text-sm text-[#989797]">
              Connecting pets with people to create happy, lifelong matches.
            </p>
          </div>

          {/* For Guardian*/}
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

        <div className="border-t border-[#CEA74E] pt-8">
          <p className="text-center text-sm text-[#CEA74E]">
            &copy; 2026 Furpect Match. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
