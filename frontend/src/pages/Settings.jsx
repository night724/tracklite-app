import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Settings() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("account");
    const [name, setName] = useState("Knight");
    const [email, setEmail] = useState("knight@email.com");
    const [editing, setEditing] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] =
        useState({
            task: true,
            issue: true,
            comment: false,
            invite: true
        });
    function saveProfile() {
        setEditing(false);
        alert(
            "Profile updated successfully"
        );
    }

    function changePassword() {
        alert(
            "Password change feature coming soon"
        );
    }

    function deleteWorkspace() {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete workspace?"
            );
        if (confirmDelete) {

            alert(
                "Workspace deleted"
            );

        }

    }




    return (


        <div className="settings-page">



            <div className="settings-header">


                <h1>
                    Settings
                </h1>


                <p>
                    Manage your account and TrackLite preferences
                </p>


            </div>





            <div className="settings-layout">





                {/* LEFT MENU */}


                <div className="settings-menu">


                    <h3>
                        Preferences
                    </h3>



                    <button
                        className={
                            activeTab === "account"
                                ?
                                "active"
                                :
                                ""
                        }

                        onClick={() =>
                            setActiveTab("account")
                        }
                    >

                        👤 Account

                    </button>





                    <button
                        className={
                            activeTab === "security"
                                ?
                                "active"
                                :
                                ""
                        }

                        onClick={() =>
                            setActiveTab("security")
                        }
                    >

                        🔒 Security

                    </button>





                    <button
                        className={
                            activeTab === "alerts"
                                ?
                                "active"
                                :
                                ""
                        }

                        onClick={() =>
                            setActiveTab("alerts")
                        }
                    >

                        🔔 Alerts

                    </button>





                    <button
                        className={
                            activeTab === "appearance"
                                ?
                                "active"
                                :
                                ""
                        }

                        onClick={() =>
                            setActiveTab("appearance")
                        }
                    >

                        🎨 Appearance

                    </button>





                    <button
                        className={
                            activeTab === "workspace"
                                ?
                                "active"
                                :
                                ""
                        }

                        onClick={() =>
                            setActiveTab("workspace")
                        }
                    >

                        🏢 Workspace

                    </button>





                    <button
                        className={
                            activeTab === "danger"
                                ?
                                "active danger"
                                :
                                ""
                        }

                        onClick={() =>
                            setActiveTab("danger")
                        }
                    >

                        ⚠ Danger

                    </button>



                </div>







                {/* CONTENT */}



                <div className="settings-content">






                    {
                        activeTab === "account" &&


                        <div className="settings-card">


                            <h2>
                                👤 Profile
                            </h2>



                            <div className="profile-area">


                                <div className="profile-avatar">

                                    {name.charAt(0)}

                                </div>



                                <div>

                                    <h3>
                                        {name}
                                    </h3>


                                    <p>
                                        {email}
                                    </p>


                                </div>


                            </div>






                            {
                                editing ?


                                    <>


                                        <label>
                                            Name
                                        </label>


                                        <input

                                            value={name}

                                            onChange={
                                                e =>
                                                    setName(
                                                        e.target.value
                                                    )
                                            }

                                        />



                                        <label>
                                            Email
                                        </label>


                                        <input

                                            value={email}

                                            onChange={
                                                e =>
                                                    setEmail(
                                                        e.target.value
                                                    )
                                            }

                                        />



                                        <button

                                            className="primary-btn"

                                            onClick={saveProfile}

                                        >

                                            Save Changes

                                        </button>


                                    </>


                                    :


                                    <button

                                        className="secondary-btn"

                                        onClick={() =>
                                            setEditing(true)
                                        }

                                    >

                                        Edit Profile

                                    </button>


                            }


                        </div>

                    }








                    {
                        activeTab === "security" &&


                        <div className="settings-card">


                            <h2>
                                🔒 Security
                            </h2>


                            <p>
                                Keep your TrackLite account safe.
                            </p>


                            <button

                                className="secondary-btn"

                                onClick={changePassword}

                            >

                                Change Password

                            </button>


                        </div>

                    }









                    {
                        activeTab === "alerts" &&


                        <div className="settings-card">


                            <h2>
                                🔔 Notifications
                            </h2>




                            {
                                Object.keys(notifications)
                                    .map(item => (


                                        <div
                                            className="toggle-row"
                                            key={item}
                                        >


                                            <span>
                                                {item}
                                            </span>


                                            <input

                                                type="checkbox"

                                                checked={
                                                    notifications[item]
                                                }


                                                onChange={
                                                    e =>
                                                        setNotifications({

                                                            ...notifications,

                                                            [item]:
                                                                e.target.checked

                                                        })
                                                }

                                            />


                                        </div>


                                    ))

                            }



                        </div>

                    }









                    {
                        activeTab === "appearance" &&


                        <div className="settings-card">


                            <h2>
                                🎨 Appearance
                            </h2>



                            <div className="toggle-row">


                                <span>
                                    Dark Mode
                                </span>



                                <input

                                    type="checkbox"

                                    checked={darkMode}

                                    onChange={
                                        e =>
                                            setDarkMode(
                                                e.target.checked
                                            )
                                    }

                                />


                            </div>



                        </div>

                    }









                    {
                        activeTab === "workspace" &&


                        <div className="settings-card">


                            <h2>
                                🏢 Workspace
                            </h2>


                            <p>
                                Manage your TrackLite team.
                            </p>



                            <div className="workspace-box">


                                <strong>
                                    TrackLite Workspace
                                </strong>


                                <p>
                                    Manage members and projects.
                                </p>


                            </div>




                            <button

                                className="primary-btn"

                                onClick={() =>
                                    navigate("/team")
                                }

                            >

                                Manage My Team

                            </button>


                        </div>

                    }









                    {
                        activeTab === "danger" &&


                        <div className="settings-card danger-card">


                            <h2>
                                ⚠ Danger Zone
                            </h2>


                            <p>
                                Delete workspace permanently.
                            </p>



                            <button

                                className="delete-btn"

                                onClick={deleteWorkspace}

                            >

                                Delete Workspace

                            </button>


                        </div>

                    }




                </div>



            </div>



        </div>


    );

}


export default Settings;