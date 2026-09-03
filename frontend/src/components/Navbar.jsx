import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const location = useLocation();

    const [open, setOpen] = useState(false);

    const showBackButton = location.pathname !== '/dashboard';

    function goBack() {
        navigate(-1);
    }

    return (
        <header className="navbar">
            {/* LEFT SIDE */}

            <div className="navbar-left">
                {showBackButton && (
                    <button className="back-button" onClick={goBack}>
                        ← Back
                    </button>
                )}

                <div className="brand-area">
                    <h2>TrackLite</h2>

                    <span>Workspace</span>
                </div>
            </div>

            {/* RIGHT SIDE */}

            <div className="navbar-right">
                <button
                    className="notification-btn"
                    onClick={() => navigate('/inbox')}
                >
                    🔔
                </button>

                <div className="user-menu" onClick={() => setOpen(!open)}>
                    <div className="user-avatar">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="user-info">
                        <strong>{user?.name || 'User'}</strong>

                        <small>Member</small>
                    </div>

                    <span>▾</span>
                </div>

                {open && (
                    <div className="user-dropdown">
                        <button onClick={() => navigate('/settings')}>
                            ⚙ Settings
                        </button>

                        <button onClick={logout}>🚪 Logout</button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Navbar;
