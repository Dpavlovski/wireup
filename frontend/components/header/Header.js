import {useAuth} from "../../utils/AuthProvider";
import Image from "next/image";
import logo from "../../styles/logo.png";
import Link from "next/link";
import {ChartBarIcon, DocumentTextIcon, UserCircleIcon} from "@heroicons/react/24/outline";
import {ArrowRightOnRectangleIcon} from "@heroicons/react/20/solid";

export default function Header() {
    const {user, logout} = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <Image
                            src={logo}
                            alt="Logo"
                            width={121}
                            height={56}
                            className="h-14 w-auto"
                        />
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-6">
                        {user && user.role === "admin" && (
                            <nav className="hidden md:flex items-center gap-4">
                                <Link
                                    href="/admin/tests"
                                    className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    <DocumentTextIcon className="h-5 w-5 mr-2"/>
                                    Tests
                                </Link>
                                <Link
                                    href="/admin/templates"
                                    className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    Templates
                                </Link>
                                <Link
                                    href="/admin/stats"
                                    className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    <ChartBarIcon className="h-5 w-5 mr-2"/>
                                    Stats
                                </Link>
                            </nav>
                        )}

                        {/* User Info & Logout */}
                        {user && (
                            <div className="flex items-center gap-4 ml-4 border-l border-gray-200 pl-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <UserCircleIcon className="h-5 w-5 mr-2 text-gray-400"/>
                                    <span className="font-medium">{user.username}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                >
                                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1.5"/>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}