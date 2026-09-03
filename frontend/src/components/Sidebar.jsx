import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {

    const { user } = useAuth();

    const workspaceId = user?.workspaceId;


    const menu = [

        {
            name: "Inbox",
            icon: "📥",
            path: "/inbox"
        },

        {
            name: "Dashboard",
            icon: "📊",
            path: "/dashboard"
        },

        {
            name: "Projects",
            icon: "📁",
            path: `/workspace/${workspaceId}/projects`
        },

        {
            name: "My Team",
            icon: "👥",
            path: "/team"
        },

        {
            name: "Settings",
            icon: "⚙",
            path: "/settings"
        }

    ];



    return (

        <aside className="sidebar">


            <div className="sidebar-brand">


                <div className="sidebar-logo">
                    T
                </div>


                <div>
                    <h2>
                        TrackLite
                    </h2>

                    <span>
                        Workspace
                    </span>
                </div>


            </div>





            <nav className="sidebar-menu">


                {
                    menu.map((item) => (

                        <NavLink

                            key={item.name}

                            to={item.path}

                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar-link active"
                                    : "sidebar-link"
                            }

                        >

                            <span className="menu-icon">
                                {item.icon}
                            </span>


                            <span>
                                {item.name}
                            </span>


                        </NavLink>

                    ))
                }


            </nav>




            <div className="workspace-card">


                <small>
                    Current Workspace
                </small>


                <strong>
                    TrackLite Team
                </strong>


            </div>


        </aside>

    );
}


export default Sidebar;