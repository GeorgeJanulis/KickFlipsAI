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
      // Build the sales data first
      const recentSalesData = filtered.map(flip => ({
        sneaker_name: flip.sneaker_name,
        purchase_price: flip.purchase_price,
        sell_price: flip.sell_price,
        condition: flip.condition,
        size: flip.size,
        hold_time_days: flip.sell_date 
          ? Math.round((new Date(flip.sell_date) - new Date(flip.purchase_date)) / (1000*60*60*24)) 
          : null
      }));
  
      // Send to API
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: term, data: recentSalesData }),
      });
  
      if (!res.ok) throw new Error("Failed to get AI response");
  
      const data = await res.json();
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-10">
      <div className="max-w-5xl mx-auto px-4 text-center">
        {/* Title */}
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900 dark:text-gray-100 text-center">
          Sales
        </h1>
  
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-10">
          <input
            type="text"
            placeholder="Search for sneakers..."
            className="w-full px-5 py-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 
                       bg-white/70 dark:bg-gray-800/70 backdrop-blur-md 
                       focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600 
                       placeholder-gray-400 dark:placeholder-gray-500 
                       text-gray-900 dark:text-gray-100 text-lg transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
            🔍
          </div>
        </div>
  
        {/* Content */}
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading sales...</p>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
            {filtered.map((flip) => (
              <FlipCard key={flip.id} flip={flip} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">
            No sneakers found
          </p>
        )}
  
        {/* AI Insights */}
        <section className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            AI Insights
          </h2>
          {aiLoading ? (
            <p className="text-gray-500 dark:text-gray-400">Thinking...</p>
          ) : aiResponse ? (
            <div className="max-w-2xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-lg text-left">
              <p className="text-gray-900 dark:text-gray-100 whitespace-pre-line">
                {aiResponse}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              Search a sneaker to get insights
            </p>
          )}
        </section>

      </div>
    </div>
  );
  
}
