"use client"

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AddSneakerForm({ onAdded }) {
    const [form, setForm] = useState({
        sneaker_name: "",
        purchase_price: "",
        purchase_date: "",
        condition: "",
        fees: "",
        size: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Get the current logged-in session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
            alert("You must be logged in to add a sneaker.");
            setLoading(false);
            return;
        }

        const { error } = await supabase.from("sneakers").insert([
            {
                user_id: session.user.id, // <-- fixed
                sneaker_name: form.sneaker_name,
                purchase_price: parseFloat(form.purchase_price),
                purchase_date: form.purchase_date,
                condition: form.condition,
                size: form.size,
            },
        ]);

        setLoading(false);

        if (error) {
            alert("Error adding sneaker: " + error.message);
        } else {
            alert("Sneaker added!");
            setForm({
                sneaker_name: "",
                purchase_price: "",
                purchase_date: "",
                condition: "",
                size: "",
            });
            onAdded?.(); // refresh flips in parent
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="big-white dark:bg-gray-800 p-4 rounded-lg shadow w-full max-w-md space-y-3"
        >
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Information</h2>

            <input
                name="sneaker_name"
                placeholder="Sneaker name"
                value={form.sneaker_name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded"
                required
            />
            <input
                name="purchase_price"
                type="number"
                placeholder="Purchase price"
                value={form.purchase_price}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded"
                required
            />
            <input
                name="purchase_date"
                type="date"
                placeholder="Date"
                value={form.purchase_date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded"
                required
            />
            <input
                name="condition"
                placeholder="e.g. New, Used"
                value={form.condition}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded"
                required
            />
            <input
                name="size"
                type="number"
                placeholder="Size"
                value={form.size}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded"
                required
            />

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
            >
                {loading ? "Adding..." : "Add Sneaker"}
            </button>
        </form>
    );
}
