"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function FlipCard({ flip, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const profit =
    flip.sell_price != null
      ? flip.sell_price - flip.purchase_price - (flip.fees || 0)
      : null;
  const holdTime =
    flip.sell_date != null
      ? Math.ceil(
          (new Date(flip.sell_date) - new Date(flip.purchase_date)) /
            (1000 * 60 * 60 * 24)
        )
      : null;

  const handleMarkSold = async () => {
    const sellPriceInput = prompt("Enter sell price ($):");
    const sellDateInput = prompt("Enter sell date (YYYY-MM-DD):");
    const fees = prompt("Fees:");

    if (!sellPriceInput || !sellDateInput || !fees) return;

    const sellPrice = parseFloat(sellPriceInput);
    const sellDate = new Date(sellDateInput).toISOString().split("T")[0];
    const finalFees = parseFloat(fees)

    console.log("Updating flip ID:", flip.id);
    console.log("Sell price:", sellPrice, "Sell date:", sellDate);

    setLoading(true);

    const { data, error } = await supabase
      .from("sneakers")
      .update({
        sell_price: sellPrice,
        sell_date: sellDate,
        fees: finalFees,
      })
      .eq("id", flip.id);

    setLoading(false);

    if (error) {
      console.error("Supabase update error:", error);
      alert("Error marking as sold: " + error.message);
    } else {
      console.log("Updated row:", data);
      alert("Sneaker marked as sold!");
      onUpdate?.();
    }
  };

  return (
    <div className="big-white dark:bg-gray-800 rounded-lg p-4 shadow-md flex-col space-y-2 w-64">
      <span className="font-bold text-lg">{flip.sneaker_name}</span>

      <div className="flex justify-between text-sm text-gray-600">
        <span>Bought: ${flip.purchase_price}</span>
        <span>
          Sold for: {flip.sell_price != null ? `$${flip.sell_price}` : "-"}
        </span>
      </div>

      <div className="flex justify-between text-sm">
        <span
          className={
            profit == null
              ? "text-blue-600 font-semibold"
              : profit > 0
              ? "text-green-600 font-semibold"
              : "text-red-600 font-semibold"
          }
        >
          Profit: {profit != null ? `$${profit}` : "-"}
        </span>
        <span>Hold: {holdTime != null ? `${holdTime}d` : "-"}</span>
      </div>

      <div className="flex justify-between text-sm text-gray-500">
        <span>Condition: {flip.condition}</span>
        {flip.fees && <span className="italic">Fees: {flip.fees}</span>}
      </div>

      {!flip.sell_date && (
        <button
          onClick={handleMarkSold}
          disabled={loading}
          className="bg-blue-600 text-white py-1 px-3 rounded text-sm w-full mt-2"
        >
          {loading ? "Saving..." : "Mark as Sold"}
        </button>
      )}
    </div>
  );
}
