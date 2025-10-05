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
      // SIGN UP
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) return alert(error.message);

      // Optional: create a profile with username
      if (username) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          username
        });
      }

      alert("Sign-up successful! Please confirm your email if required.");
    } else {
      // LOGIN
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) return alert(error.message);
        router.push("/portfolio");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-2">
      <h1 className="text-2xl font-bold">{isSignUp ? "Sign Up" : "Login"}</h1>

      {isSignUp && (
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="border p-2 rounded"
        />
      )}

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border p-2 rounded"
      />

      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
        {isSignUp ? "Sign Up" : "Login"}
      </button>

      <button
        className="text-sm text-gray-500 mt-2"
        onClick={() => setIsSignUp(!isSignUp)}
      >
        {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
      </button>
    </div>
  );
}
