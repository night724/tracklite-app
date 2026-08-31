import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function AppLayout() {
    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main">
                <Navbar />
                <section className="content">
                    <Outlet />
                </section>
            </div>
        </div>
    );
}

export default AppLayout;