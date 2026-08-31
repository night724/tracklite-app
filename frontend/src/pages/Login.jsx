import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError]  = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await login(
                email,
                password
            );
            navigate("/dashboard");
        }
        catch (err) {
            setError(
                err.response?.data?.message
                ||
                "Login failed"
            );
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>
                    TrackLite
                </h1>
                <h2>
                    Login
                </h2>
                {
                    error &&
                    <p className="error">
                        {error}
                    </p>
                }

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={
                            e => setEmail(e.target.value)
                        }
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={
                            e => setPassword(e.target.value)
                        }
                    />
                    <button> Login </button>
                </form>
                <p>
                    No account?
                    <Link to="/register">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;