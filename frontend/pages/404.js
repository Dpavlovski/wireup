import {useAuth} from "../utils/AuthProvider";
import {useRouter} from "next/router";

export default function Custom404() {
    const auth = useAuth();
    const router = useRouter();
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
                <p className="text-2xl text-gray-800 mb-4">Page Not Found</p>
                <p className="text-gray-600 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <button
                    onClick={() => auth.user.role === "admin" ? router.push("/admin/tests") : router.push("/")}
                    className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Return Home
                </button>
            </div>
        </div>
    )
}