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
            {/* LEFT */}

            <div className="navbar-left">
                {showBackButton && (
                    <button className="back-button" onClick={goBack}>
                        ←
                    </button>
                )}

                <div className="brand">
                    <div className="brand-logo">T</div>

                    <div>
                        <h2>TrackLite</h2>

                        <span>Project Workspace</span>
                    </div>
                </div>
            </div>

            {/* RIGHT */}

            <div className="navbar-right">
                <button
                    className="notification-btn"
                    onClick={() => navigate('/inbox')}
                >
                    🔔
                    <span className="notification-dot"></span>
                </button>

                <div className="profile" onClick={() => setOpen(!open)}>
                    <div className="avatar">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="profile-info">
                        <strong>{user?.name || 'User'}</strong>

                        <small>Member</small>
                    </div>

                    <span className="arrow">▾</span>
                </div>

                {open && (
                    <div className="dropdown">
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
