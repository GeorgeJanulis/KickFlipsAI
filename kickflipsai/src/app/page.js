"use client";

export default function HomeScreen() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800">
      
      {/* Optional soft background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent dark:via-gray-900/30"></div>

      {/* Centered Logo */}
      <img
        src="/kickFlipsLogo.png"
        alt="App Logo"
        className="relative w-96 h-96 sm:w-[28rem] sm:h-[28rem] object-contain drop-shadow-2xl"
      />

      {/* Optional tagline */}
      <div className="absolute bottom-16 text-center text-gray-700 dark:text-gray-300 text-xl font-semibold">
        Your Sneaker Hub
      </div>
    </div>
  );
}
