import { useEffect } from "react";
import { useRouter } from "next/router";
import {useAuth} from "./AuthProvider";

export default function ProtectedRoute({ is_admin = [], children }) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/login").then();
            return;
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(user.is_admin)) {
            router.push("/unauthorized").then( );
        }
    }, [user, allowedRoles, router]);

    if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role))) {
        return null;
    }

    return <>{children}</>;
}
