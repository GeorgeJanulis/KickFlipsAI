"use client";

import FlipCard from "@/components/FlipCard";
import AddSneakerForm from "@/components/AddSneakerForm";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { TrendingUp, DollarSign, Clock, Package, PiggyBank, PlusCircle } from "lucide-react";

export default function Portfolio() {
  const [flips, setFlips] = useState([]);

  const fetchFlips = async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Error getting session:", sessionError);
      return;
    }

    if (!session) {
      console.warn("No active session - user not logged in");
      setFlips([]);
      return;
    }

    const { data, error } = await supabase
      .from("sneakers")
      .select("*")
      .eq("user_id", session.user.id)
      .order("purchase_date", { ascending: false });

    if (error) console.error("Error fetching data", error);
    else setFlips(data);
  };

  useEffect(() => {
    fetchFlips();
  }, []);

  const soldFlips = flips.filter((f) => f.sell_date);
  const inventoryFlips = flips.filter((f) => !f.sell_date);

  const totalProfit = soldFlips.reduce(
    (sum, f) => sum + (f.sell_price - f.purchase_price - f.fees),
    0
  );
  const totalRevenue = soldFlips.reduce((sum, f) => sum + f.sell_price, 0);
  const avgProfit = soldFlips.length ? totalProfit / soldFlips.length : 0;
  const avgHoldTime = soldFlips.length
    ? soldFlips.reduce(
        (sum, f) =>
          sum +
          Math.ceil(
            (new Date(f.sell_date) - new Date(f.purchase_date)) /
              (1000 * 60 * 60 * 24)
          ),
        0
      ) / soldFlips.length
    : 0;
  const investment = inventoryFlips.reduce((sum, f) => sum + f.purchase_price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-10">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Sneaker Portfolio
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Track your flips, profits, and inventory — all in one place
          </p>
        </div>

      {/* Portfolio Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Portfolio Overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard
            label="Total Profit"
            value={`$${totalProfit.toFixed(2)}`}
            icon={<TrendingUp className="text-green-500" />}
          />
          <StatCard
            label="Revenue"
            value={`$${totalRevenue.toFixed(2)}`}
            icon={<DollarSign className="text-blue-500" />}
          />
          <StatCard
            label="Avg. Profit"
            value={`$${avgProfit.toFixed(2)}`}
            icon={<PiggyBank className="text-yellow-500" />}
          />
          <StatCard
            label="Avg. Hold"
            value={`${avgHoldTime.toFixed(1)}d`}
            icon={<Clock className="text-purple-500" />}
          />
          <StatCard
            label="Inventory"
            value={`$${investment.toFixed(2)}`}
            icon={<Package className="text-pink-500" />}
          />
        </div>
      </div>
      <div className="relative w-full max-w-6xl mx-auto flex items-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        {/* Left image */}
        <div className="flex-1 flex justify-center">
          <img
            src="/KickFlipsBackDrop.png"
            alt="Sneaker left"
            className="w-full max-w-xs h-auto object-cover rounded-3xl shadow-lg"
          />
        </div>

        {/* Main AddSneaker Form */}
        <div className="flex-1 flex flex-col items-center text-center px-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <PlusCircle className="text-blue-500 w-8 h-8" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Add Sneaker
            </h2>
          </div>
          <div className="w-full max-w-md">
            <AddSneakerForm onAdded={fetchFlips} />
          </div>
        </div>

        {/* Right image */}
        <div className="flex-1 flex justify-center">
          <img
            src="KickFlipsBackDrop.png"
            alt="Sneaker right"
            className="w-full max-w-xs h-auto object-cover rounded-3xl shadow-lg"
          />
        </div>
      </div>





      {/* Inventory Section */}
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Current Inventory
        </h2>

        {inventoryFlips.length > 0 ? (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {inventoryFlips.map((flip) => (
                <FlipCard key={flip.id} flip={flip} onUpdate={fetchFlips} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400 italic">
            No sneakers in inventory
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="border-t border-gray-300 dark:border-gray-700 my-12 w-2/3 mx-auto"></div>

      {/* Sales Section */}
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Sales
        </h2>

        {soldFlips.length > 0 ? (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {soldFlips.map((flip) => (
                <FlipCard key={flip.id} flip={flip} onUpdate={fetchFlips} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400 italic">No sales yet</div>
        )}
      </section>


      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {value}
        </div>
      </div>
      <div className="p-2 rounded-lg bg-white/70 dark:bg-gray-800">
        {icon}
      </div>
    </div>
  );
}
