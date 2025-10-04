import Link from 'next/link';

export default function Navbar() {
    return(
        <nav className="bg-gray-800 p-4 text-white flex space-x-4">
            <Link href="/">Home</Link>
            <Link href="/portfolio">Portfolio</Link>
            <Link href="/search">Search</Link>
            <Link href="/login">Login</Link>
        </nav>
    );
}