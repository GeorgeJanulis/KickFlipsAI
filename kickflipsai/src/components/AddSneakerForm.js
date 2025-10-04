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
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from("sneakers").insert([
            {
                user_id: '00000000-0000-0000-0000-000000000001',
                sneaker_name: form.sneaker_name,
                purchase_price: parseFloat(form.purchase_price),
                purchase_date: form.purchase_date,
                condition: form.condition,
                fees: parseFloat(form.fees) || 0,
            },
        ]);

        setLoading(false);

        if (error) alert("Error adding sneaker: " + error.message);
        else{
            alert("Sneaker added!")
            setForm({
                sneaker_name: "",
                purchase_price: "",
                purchase_date: "",
                condition: "",
                fees: "",
            });
            onAdded?.()
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="big-white dark:bg-gray-800 p-4 rounded-lg shadow w-full max-w-md space-y-3"
        >
            <h2 className="text-xl font-semibold mb-2">Add New Sneaker</h2>

            <input
                name="sneaker_name"
                placeholder="Sneaker name"
                value={form.sneaker_name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
            />
            <input
                name="purchase_price"
                type="number"
                placeholder="Purchase price"
                value={form.purchase_price}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
            />
            <input
                name="purchase_date"
                type="date"
                placeholder="date"
                value={form.purchase_date}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
            />
            <input
                name="condition"
                placeholder="e.g. New, Used"
                value={form.condition}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
            />
            <input
                name="fees"
                type="number"
                placeholder="Fees (optional)"
                value={form.fees}
                onChange={handleChange}
                className="w-full p-2 border rounded"
            />

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text py-2 px-4 rounded w-full"
            >
                {loading ? "Adding..." : "Add Sneaker"}
            </button>
        </form>
    );
}