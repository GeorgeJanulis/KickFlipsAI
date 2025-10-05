"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // optional for sign-up
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async () => {
    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return alert(error.message);

      if (username) {
        await supabase.from("profiles").insert({ id: data.user.id, username });
      }

      alert("Sign-up successful! Please confirm your email if required.");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return alert(error.message);
      router.push("/portfolio");
    }
  };

  return (
    <div className="flex min-h-screen">
      
      {/* Left image side */}
      <div className="hidden md:flex w-1/2 bg-gray-200 dark:bg-gray-800 items-center justify-center">
        <img
          src="/alt_logo.png" // your sneaker or app image
          alt="Sneaker"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right form side */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white dark:bg-gray-900 p-8">
        <div className="w-full max-w-md space-y-6">
          <h1 className="text-3xl font-bold text-center">{isSignUp ? "Sign Up" : "Login"}</h1>

          {isSignUp && (
            <input
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            />
          )}

          <input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {isSignUp ? "Sign Up" : "Login"}
          </button>

          <div className="text-center">
            <button
              className="text-sm text-gray-500 hover:underline"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp
                ? "Already have an account? Login"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
