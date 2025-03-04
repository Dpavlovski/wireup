import {useAuth} from "../../utils/AuthProvider";
import Image from "next/image";
import logo from "../../styles/logo.png";
import Link from "next/link";

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
        <>
            <nav className="container navbar navbar-light justify-content-between px-4">
                <Image src={logo} alt="Logo" width={121} height={56}/>
                <div>
                    {user && user.role === "admin" &&
                        (<>
                            <Link href="/admin/tests">
                                <button className="nav-link d-inline-block mx-2">Tests</button>
                            </Link>
                            <Link href="/admin/templates">
                                <button className="nav-link d-inline-block mx-2">Templates</button>
                            </Link>
                            <Link href="/admin/stats">
                                <button className="nav-link d-inline-block mx-2">Stats</button>
                            </Link>
                        </>)}
                    {user && <span>{user.username}</span>}
                    <button onClick={handleLogout} className="btn btn-dark mx-2">
                        Logout
                    </button>
                </div>
            </nav>
            <hr/>
        </>
    );
}
