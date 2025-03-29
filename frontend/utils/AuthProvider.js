import {createContext, useContext, useEffect, useState} from "react";
import AuthService from "../api/auth/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            const userData = await AuthService.fetchUser();
            setUser(userData);
        };
        loadUser().then();
    }, []);

    const handleLogout = async () => {
        await AuthService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, setUser, logout: handleLogout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
