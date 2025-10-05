"use client";

import FlipCard from '../../components/FlipCard';
import AddSneakerForm from "@/components/AddSneakerForm";
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Portfolio() {

    const [flips, setFlips] = useState([])

        const fetchFlips = async () => {

            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

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
                .from('sneakers')
                .select('*')
                .eq('user_id', session.user.id)
                .order('purchase_date', { ascending: false});

            if (error) console.error('Error fetching data', error)
            else setFlips(data)
        };

    useEffect(() => {
        fetchFlips()
    }, [])

    const soldFlips = flips.filter(f => f.sell_date);
    const inventoryFlips = flips.filter(f => !f.sell_date);

    const totalProfit = soldFlips.reduce((sum, f) => sum + (f.sell_price - f.purchase_price - f.fees), 0);
    const totalRevenue = soldFlips.reduce((sum, f) => sum + f.sell_price, 0);
    const avgProfit = soldFlips.length ? totalProfit / soldFlips.length : 0;
    const avgHoldTime = soldFlips.length
        ? soldFlips.reduce((sum, f) => {
            const holdTime = Math.ceil((new Date(f.sell_date) - new Date(f.purchase_date)) / (1000*60*60*24));
            return sum + holdTime;
        }, 0) / soldFlips.length
        : 0;
    const investment = inventoryFlips.reduce((sum, f) => sum + f.purchase_price, 0);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">My Portfolio</h1>
            <AddSneakerForm onAdded={fetchFlips} />

            {/* Summary */}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                <StatCard label="Total Profit" value={ `$${totalProfit.toFixed(2)}`} />
                <StatCard label="Total Revenue" value={ `$${totalRevenue.toFixed(2)}`} />
                <StatCard label="Avg. Profit" value={ `$${avgProfit.toFixed(2)}`} />
                <StatCard label="Avg. Hold Time" value={ `${avgHoldTime.toFixed(1)} days`} />
                <StatCard label="Inventory Value" value={ `$${investment.toFixed(2)}`} />

            </div>

            {/* Current Inventory */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Inventory</h2>
                {inventoryFlips.length > 0 ? (
                    <div className="grid grid-cols-1 sm: grid-cols-2 md:grid-cols-3: lg:grid-cols-4 gap-4">
                        {inventoryFlips.map((flip, idx) => (
                            <FlipCard key={flip.id} flip={flip} onUpdate={fetchFlips}/>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No sneakers in inventory</p>
                )}
            </section>

            {/* Inventory that has sold */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Sales</h2>
                {soldFlips.length > 0 ? (
                    <div className="grid grid-cols-1 sm: grid-cols-2 md:grid-cols-3: lg:grid-cols-4 gap-4">
                        {soldFlips.map((flip, idx) => (
                            <FlipCard key={flip.id} flip={flip} onUpdate={fetchFlips}/>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No sales</p>
                )}
            </section>
        </div>
    );
}

function StatCard({label, value}) {
    return (
        <div className="big-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <div className="text-sm text-gray-500">{label}</div>
            <div className="text-xl font-semibold">{value}</div>
        </div>
    )
}