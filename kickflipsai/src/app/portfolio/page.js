import FlipCard from '../../components/FlipCard';

const mockFlips = [
    {
        sneakerName: "Jordan 1 High Chicago",
        purchasePrice: 200,
        sellPrice: 350,
        fees: 25,
        purchaseDate: "2025-10-01",
        sellDate: "2025-10-04",
        condition: "New",
    },

    {
        sneakerName: "Jordan 4 Bred",
        purchasePrice: 120,
        sellPrice: 220,
        fees: 19,
        purchaseDate: "2025-09-28",
        sellDate: "2025-10-02",
        condition: "Used",
    },

    {
        sneakerName: "Dunk Low Panda",
        purchasePrice: 60,
        sellPrice: null,
        fees: null,
        purchaseDate: "2025-09-28",
        sellDate: null,
        condition: "Used",
    },
];

export default function Portfolio() {

    const soldFlips = mockFlips.filter(flip => flip.sellDate);
    const inventoryFlips = mockFlips.filter(flip => !flip.sellDate);

    const totalProfit = soldFlips.reduce((sum, f) => sum + (f.sellPrice - f.purchasePrice - f.fees), 0);
    const totalRevenue = soldFlips.reduce((sum, f) => sum + f.sellPrice, 0);
    const avgProfit = soldFlips.length ? totalProfit / soldFlips.length : 0;
    const avgHoldTime = soldFlips.length
        ? soldFlips.reduce((sum, f) => {
            const holdTime = Math.ceil((new Date(f.sellDate) - new Date(f.purchaseDate)) / (1000*60*60*24));
            return sum + holdTime;
        }, 0) / soldFlips.length
        : 0;
    const investment = inventoryFlips.reduce((sum, f) => sum + f.purchasePrice, 0);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">My Portfolio</h1>

            {/* Summary */}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                <StatCard label="Total Profit" value={ `$${totalProfit.toFixed(2)}`} />
                <StatCard label="Total Revenue" value={ `$${totalRevenue.toFixed(2)}`} />
                <StatCard label="Avg. Profit" value={ `$${avgProfit.toFixed(2)}`} />
                <StatCard label="Avg. Hold Time" value={ `$${avgHoldTime.toFixed(1)} days`} />
                <StatCard label="Inventory Value" value={ `$${investment.toFixed(2)}`} />

            </div>

            {/* Current Inventory */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Inventory</h2>
                {inventoryFlips.length > 0 ? (
                    <div className="grid grid-cols-1 sm: grid-cols-2 md:grid-cols-3: lg:grid-cols-4 gap-4">
                        {inventoryFlips.map((flip, idx) => (
                            <FlipCard key={idx} flip={flip} />
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
                            <FlipCard key={idx} flip={flip} />
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