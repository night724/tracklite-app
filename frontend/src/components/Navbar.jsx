import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Navbar() {


    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const [open, setOpen] =
        useState(false);



    return (

        <header className="navbar">


            <div className="navbar-left">

                <h3>
                    Dashboard
                </h3>

            </div>





            <div className="navbar-right">


                <button
                    className="nav-icon-btn"
                >
                    🔔
                </button>




                <div
                    className="profile-area"
                    onClick={() =>
                        setOpen(!open)
                    }
                >


                    <div className="avatar-small">

                        {
                            user?.name
                                ?.charAt(0)
                                .toUpperCase()
                        }

                    </div>



                    <div className="profile-text">

                        <strong>
                            {
                                user?.name ||
                                "User"
                            }
                        </strong>


                        <small>
                            Online
                        </small>


                    </div>


                    <span>
                        ▾
                    </span>


                </div>






                {
                    open &&

                    <div className="profile-dropdown">


                        <button
                            onClick={() =>
                                navigate("/settings")
                            }
                        >
                            ⚙ Settings
                        </button>



                        <button
                            onClick={logout}
                        >
                            🚪 Logout
                        </button>


                    </div>

                }



            </div>


        </header>

    );

}


export default Navbar;