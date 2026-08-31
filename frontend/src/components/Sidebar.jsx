import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
    const { logout } = useAuth();
    return (
        <aside className="sidebar">
            <h2 className="logo">  TrackLite </h2>
            <nav>
                <NavLink to="/dashboard">
                    Dashboard
                </NavLink>
                <NavLink to="/projects">
                    Projects
                </NavLink>
                <NavLink to="/tasks">
                    Tasks
                </NavLink>
                <NavLink to="/issues">
                    Issues
                </NavLink>
                <NavLink to="/members">
                    Members
                </NavLink>
                <NavLink to="/settings">
                    Settings
                </NavLink>
            </nav>

            <button
                className="logout-btn"
                onClick={logout}
            >
                Logout
            </button>

        </aside>
    );
}

export default Sidebar;