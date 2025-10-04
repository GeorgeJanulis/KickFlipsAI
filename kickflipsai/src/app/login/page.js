export default function Login() {
    return (
        <div className="flex justify-center items-center h-screen">
            <form className="big-gray-100 p-6 rounded shadow-md w-80">
                <h1 className="text-xl font-bold mb-4">Login</h1>
                <input type="username" placeholder="Username" className="border p-2 w-full mb-4" />
                <input type="password" placeholder="Password" className="border p-2 w-full mb-4" />
            </form>
        </div>
    );
}