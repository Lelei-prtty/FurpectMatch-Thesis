import { Link } from 'react-router-dom'
import logo from "../Assets/logo.svg";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="PawMatch Logo"
            className="h-10 md:h-12 lg:h-14 w-auto object-contain"
          />
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-8">
          <Link to="/guardian/login" className="text-gray-700 hover:text-gray-900 font-medium">For Pet Guardians</Link>
          <Link to="/provider/login" className="text-gray-700 hover:text-gray-900 font-medium">For Pet Providers</Link>
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">How It Works</a>
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Resources</a>
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">About Us</a>
        </div>

        {/* Auth Buttons */}
        <div className="flex gap-3">
          <Link
            to="/guardian/login"
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Guardian Login
          </Link>
          <Link
            to="/provider/login"
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            Provider Login
          </Link>
        </div>
      </nav>
    </header>
  )
}
