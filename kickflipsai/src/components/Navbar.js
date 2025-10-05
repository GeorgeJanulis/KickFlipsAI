import Link from "next/link";
import { Home, Box, Search, User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-blue-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-center space-x-4">
        <Link
          href="/"
          className="flex items-center gap-1 bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-colors"
        >
          <Home className="w-4 h-4" /> Home
        </Link>
        <Link
          href="/portfolio"
          className="flex items-center gap-1 bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-colors"
        >
          <Box className="w-4 h-4" /> Portfolio
        </Link>
        <Link
          href="/search"
          className="flex items-center gap-1 bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-colors"
        >
          <Search className="w-4 h-4" /> Search
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-1 bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-colors"
        >
          <User className="w-4 h-4" /> Login
        </Link>
      </div>
    </nav>
  );
}
