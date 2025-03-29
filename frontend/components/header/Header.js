import {useAuth} from "../../utils/AuthProvider";
import Image from "next/image";
import logo from "../../styles/logo.png";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {UserCircleIcon} from "@heroicons/react/24/outline";
import {ArrowRightEndOnRectangleIcon} from "@heroicons/react/16/solid";

function NavLink({href, children}) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href}
              className={`
          text-black 
          text-decoration-none
          hover:text-gray-600
          transition-colors
          ${isActive ? "font-semibold" : "font-normal"}
        `}
        >
            {children}
        </Link>
    );
}

export default function Header() {
    const {user, logout} = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
        }
    };

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href={user && user.role === "admin" ? "/admin/tests" : "/"}>

                        <Image
                            src={logo}
                            alt="Logo"
                            width="121"
                            height="auto"
                            className="h-14 w-auto"
                            priority
                        />

                    </Link>

                    <div className="flex items-center gap-8">

                        {user && user.role === "admin" && (
                            <nav aria-label="Admin Navigation" className="hidden md:flex items-center gap-8">
                                <NavLink href="/admin/tests">Tests</NavLink>
                                <NavLink href="/admin/templates">Templates</NavLink>
                                <NavLink href="/admin/stats">Stats</NavLink>
                            </nav>
                        )}

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
                                    <ArrowRightEndOnRectangleIcon className="h-5 w-5 mr-1.5"/>
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
