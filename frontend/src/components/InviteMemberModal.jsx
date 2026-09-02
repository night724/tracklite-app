import { useState } from "react";
import api from "../api/client";

function InviteMemberModal({
    workspaceId,
    closeModal,
    refresh
}) {

    const [email, setEmail] = useState("");
    const [role, setRole] = useState("MEMBER");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");


    async function inviteMember(e) {

        e.preventDefault();

        if (!email.trim()) return;


        try {

            setLoading(true);


            await api.post(
                "/team/invite",
                {
                    workspace_id: workspaceId,
                    email,
                    role
                }
            );


            setMessage(
                "Invitation sent successfully"
            );
            setEmail("");
            refresh();
            setTimeout(() => {
                closeModal();
            }, 1500);
        }
        catch (error) {

            console.log(error);

            setMessage(
                error.response?.data?.message ||
                "Invite failed"
            );

        }
        finally {

            setLoading(false);

        }

    }



    return (

        <div className="modal-overlay">


            <div className="invite-modal">


                <div className="modal-header">

                    <div>

                        <h2>
                            Invite Member
                        </h2>

                        <p>
                            Add someone to your workspace
                        </p>

                    </div>


                    <button
                        className="close-btn"
                        onClick={closeModal}
                    >
                        ×
                    </button>


                </div>





                <form onSubmit={inviteMember}>


                    <label>
                        Email Address
                    </label>


                    <input
                        type="email"
                        placeholder="example@email.com"
                        value={email}
                        onChange={
                            e => setEmail(e.target.value)
                        }
                    />





                    <label>
                        Workspace Role
                    </label>


                    <select
                        value={role}
                        onChange={
                            e => setRole(e.target.value)
                        }
                    >

                        <option value="MEMBER">
                            Member
                        </option>

                        <option value="ADMIN">
                            Admin
                        </option>

                    </select>






                    <div className="role-info">

                        <strong>
                            {role}
                        </strong>

                        <p>

                            {
                                role === "ADMIN"
                                    ?
                                    "Can manage workspace members and settings"
                                    :
                                    "Can access projects and collaborate"

                            }

                        </p>

                    </div>





                    {
                        message &&
                        <p className="modal-message">
                            {message}
                        </p>
                    }






                    <div className="modal-actions">


                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={closeModal}
                        >
                            Cancel
                        </button>


                        <button
                            className="primary-btn"
                            disabled={loading}
                        >

                            {
                                loading
                                    ?
                                    "Sending..."
                                    :
                                    "Send Invite"
                            }

                        </button>


                    </div>



                </form>



            </div>


        </div>

    );

}


export default InviteMemberModal;