import {useEffect} from "react";
import {useRouter} from "next/router";
import {useAuth} from "./AuthProvider";

export default function ProtectedRoute({allowedRoles = [], children}) {
    const {user} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/login").then();
            return;
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
            router.push("/error/unauthorized").then();
        }
    }, [user, allowedRoles, router]);

    if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role))) {
        return null;
    }

    return <>{children}</>;
}
