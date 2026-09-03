import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await register(form);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>TrackLite</h1>
                <h2>Create Account</h2>
                {error && <p className="error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        name="name"
                        placeholder="Name"
                        value={form.name}
                        onChange={handleChange}
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                    />

                    <button> Register </button>
                </form>

                <p>
                    Already have account?
                    <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
