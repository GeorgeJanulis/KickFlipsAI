export default function FlipCard({ flip }) {
    const profit = flip.sellPrice ? flip.sellPrice - flip.purchasePrice - flip.fees : null;
    const holdTime = flip.sellDate
        ? Math.ceil((new Date(flip.sellDate) - new Date(flip.purchaseDate)) / (1000*60*60*24))
        : null;

    return (
        <div className="big-white dark:big-gray-800 rounded-lg p-4 shadow-md flex-col space-y-2 w-64">
            <span className="font-bold text-lg">{flip.sneakerName}</span>

            <div className="flex justify-between text-sm text-gray-600">
                <span className="text-sm">Bought: ${flip.purchasePrice}</span>
                <span className="text-sm">Sold for: {flip.sellPrice !== null ? `$${flip.sellPrice}` : "-"}</span>
            </div>

            <div className="flex justify-between text-sm">
                <span className={profit == null ? 'text-blue-600 font-semibold' : profit > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                    Profit: ${profit !== null ? `${profit}` : "-"}
                </span>
                <span>Hold: {holdTime !== null ? `${holdTime}d` : "-"}</span>
            </div>

            <div className="flex justify-between text-sm text-gray-500">
                <span>Condition: {flip.condition}</span>
                {flip.fees && <span className = "italic">Fees: {flip.fees}</span>}
            </div>

            {/*<p>Fees: ${flip.fees}</p> 
            <p>Profit: ${flip.sellPrice - flip.purchasePrice - flip.fees}</p>
            <p>Confition: {flip.condition}</p>
            <p>Days in inventory: {
                Math.ceil((new Date(flip.sellDate) - new Date(flip.purchaseDate)) / (1000*60*60*24))
            }</p>*/}
        </div>
    );
}