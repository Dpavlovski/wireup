import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useAuth} from "../../utils/AuthProvider";
import {login, register} from "../../utils/api";

export default function AuthForm() {
    const [isRegister, setIsRegister] = useState(true);
    const [formData, setFormData] = useState({username: "", password: ""});
    const [error, setError] = useState(null);
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
        try {
            if (isRegister) {
                await register(formData.username, formData.password);
            }
            const loggedInUser = await login(formData.username, formData.password);
            setUser(loggedInUser);
        } catch (err) {
            setError(err.message || "Something went wrong");
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="card p-4 shadow-sm" style={{maxWidth: "400px", width: "100%"}}>
                <h2 className="card-title text-center mb-4">{isRegister ? "Register" : "Login"}</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                            Username
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        {isRegister ? "Register & Login" : "Login"}
                    </button>
                </form>
                <div className="mt-3 text-center">
                    <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => setIsRegister(!isRegister)}
                    >
                        {isRegister ? "Already have an account? Login" : "New here? Register"}
                    </button>
                </div>
            </div>
        </div>
    );
}
