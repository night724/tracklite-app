import { useAuth } from "../context/AuthContext";
function Navbar() {
    const { user } = useAuth();

    return (
        <header className="navbar">
            <h3> Dashboard </h3>
            <div className="profile">
                {
                    user &&
                    <>
                        <span> {user.name} </span>
                    </>
                }
            </div>
        </header>
    );
}

export default Navbar;