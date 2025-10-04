export default function Search() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Search Sneakers</h1>
            <input
                type="text"
                placeholder="Enter sneaker"
                className="border p-2 mb-4 w-full"
            />
            <div className="grid grid-cols 1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* flipcard component here */}
            </div>
        </div>
    );
}