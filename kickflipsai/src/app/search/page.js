"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import FlipCard from "@/components/FlipCard";

export default function Search() {
  const [search, setSearch] = useState("");
  const [sales, setSales] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    getSession();
  }, []);

  useEffect(() => {
    if (!session) return;
    fetchSales();
  }, [session]);

  const fetchSales = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("sneakers")
      .select("*")
      .neq("user_id", session.user.id)
      .not("sell_date", "is", null)
      .order("sell_date", { ascending: false });

    if (error) console.error("Error fetching sales:", error);
    else {
      setSales(data);
      setFiltered(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const lower = search.toLowerCase();
    const results = sales.filter((s) =>
      s.sneaker_name.toLowerCase().includes(lower)
    );
    setFiltered(results);
  }, [search, sales]);

  const fetchAIResponse = async (term) => {
    if (!term.trim()) return;
    setAiResponse("");
    setAiLoading(true);
  
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: term }),
      });
  
      // If res is empty or failed, throw an error
      if (!res.ok) {
        throw new Error("Failed to get AI response");
      }
  
      const data = await res.json(); // ✅ this only works if backend returns JSON
      setAiResponse(data.text);
    } catch (err) {
      console.error("AI fetch error:", err);
      setAiResponse("Error fetching AI insights.");
    }
  
    setAiLoading(false);
  };
  

  useEffect(() => {
    if (search.length > 2) {
      fetchAIResponse(search);
    }
  }, [search]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Marketplace</h1>
      <input
        type="text"
        placeholder="Search for sneakers..."
        className="w-full p-2 border rounded mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading sales...</p>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((flip) => (
            <FlipCard key={flip.id} flip={flip} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No sneakers found</p>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-2">AI Insights</h2>
        {aiLoading ? (
          <p>Thinking...</p>
        ) : aiResponse ? (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow">
            <p>{aiResponse}</p>
          </div>
        ) : (
          <p className="text-gray-500">Search a sneaker to get insights</p>
        )}
      </section>
    </div>
  );
}
