import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useAuth} from "../../utils/AuthProvider";
import logo from "../../styles/logo.png"
import Image from "next/image";
import Loader from "../loader/loader";
import AuthService from "../../api/auth/auth.service";

export default function AuthForm() {
    const [isRegister, setIsRegister] = useState(true);
    const [formData, setFormData] = useState({username: "", password: ""});
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const {user, setUser} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            if (user.role === "admin") {
                router.push("/admin/tests").then();
            } else router.push("/").then();
        }
    }, [user, router]);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (formData.username.length < 3 || formData.password.length < 3) {
            setError("Username and password must be at least 3 characters");
            setIsLoading(false);
            return;
        }

        try {
            if (isRegister) {
                await AuthService.register(formData.username, formData.password);
            }
            const loggedInUser = await AuthService.login(formData.username, formData.password);

            setUser(loggedInUser);

        } catch (err) {
            if (err.response) {
                setError(err.response.data.detail || "An error occurred");
            } else {
                setError(err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-container">

            <div className="logo_container">
                <Image
                    src={logo}
                    alt="App Logo"
                    className="h-14 w-auto"
                    width="120"
                    height="auto"
                    priority
                />
            </div>

            <div className="title-container flex items-center justify-center gap-2 mb-4">
                <p className="title text-2xl font-bold">{isRegister ? "Create Account" : "Welcome back!"}</p>
            </div>
            <form className="form" onSubmit={handleSubmit}>
                {isRegister && <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-200 text-sm text-gray-700">
                    ℹ️ Before accessing the survey, please create an account. Choose a username that you'll remember but
                    is also as anonymous as possible.
                </div>}
                <input
                    type="text"
                    className="input"
                    placeholder="Username"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    className="input"
                    placeholder="Password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                {error && (
                    <div className="mt-2 text-red-600 text-sm flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20"
                             fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"/>
                        </svg>
                        {error}
                    </div>
                )}
                {isLoading ? <Loader/> :
                    <button className="form-btn">
                        {isRegister ? "Sign up" : "Login"}
                    </button>
                }
            </form>

            <p className="sign-up-label">
                {isRegister ? "Already have an account?" : "Don't have an account?"}
                <span
                    onClick={() => setIsRegister(!isRegister)}
                    className="sign-up-link"
                >
                    {isRegister ? "Sign In" : "Sign Up"}
                </span>
            </p>
        </div>
    );
}