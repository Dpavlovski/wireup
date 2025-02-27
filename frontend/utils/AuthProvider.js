import {createContext, useContext, useEffect, useState} from "react";
import {fetchUser, logout} from "./api";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            const userData = await fetchUser();
            setUser(userData);
        };
        loadUser().then();
    }, []);

    const handleLogout = async () => {
        await logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, setUser, logout: handleLogout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
