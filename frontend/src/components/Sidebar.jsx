import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
    const { logout, user } = useAuth();
    const workspaceId = user?.workspaceId;

    return (
        <aside className="sidebar">
            <h2 className="logo">TrackLite</h2>

            <nav>
                <NavLink
                    to="/inbox"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                >
                    📥 Inbox
                </NavLink>

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                >
                    📊 Dashboard
                </NavLink>

                <NavLink
                    to={`/workspace/${workspaceId}/projects`}
                    className={({ isActive }) => (isActive ? 'active' : '')}
                >
                    📁 Project
                </NavLink>

                <NavLink
                    to="/team"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                >
                    👥 My Team
                </NavLink>

                <NavLink
                    to="/settings"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                >
                    ⚙ Settings
                </NavLink>
            </nav>
        </aside>
    );
}

export default Sidebar;
