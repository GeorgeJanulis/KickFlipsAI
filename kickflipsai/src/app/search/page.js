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
            .order("sell_date", { ascending: false});

        if (error) console.error("Error fetching sales:", error);
        else{
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
    }, [search, sales])

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
        </div>
    );
}