import {LockClosedIcon} from '@heroicons/react/24/outline'
import {useRouter} from "next/router";
import {useAuth} from "../../utils/AuthProvider";

export default function UnauthorizedPage(props) {
    const router = useRouter()
    const auth = useAuth();
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full space-y-8 text-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="bg-red-100 p-4 rounded-full">
                        <LockClosedIcon className="h-12 w-12 text-red-600"/>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold text-gray-900">401 Unauthorized</h1>
                        <h2 className="text-2xl font-semibold text-red-600">
                            Access Denied
                        </h2>
                    </div>

                    <p className="mt-4 text-gray-600">
                        You don't have permission to access this page. Please check your credentials or
                        contact your administrator for assistance.
                    </p>

                    <button
                        onClick={() => auth.user.role === "admin" ? router.push("/admin/tests") : router.push("/")}
                        className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        </div>
    )
}