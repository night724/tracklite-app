import { useEffect, useState } from "react";
import api from "../api/client";


function InviteMemberModal({
    workspaceId,
    closeModal,
    refresh
}) {


    const [users, setUsers] = useState([]);

    const [form, setForm] = useState({
        user_id: "",
        role: "MEMBER"
    });



    useEffect(() => {

        loadUsers();

    }, []);



    async function loadUsers() {

        try {

            const res =
                await api.get(
                    "/members/users"
                );

            setUsers(res.data);


        }
        catch (error) {

            console.log(error);

        }

    }



    async function submit(e) {

        e.preventDefault();


        try {
            console.log(form);
            await api.post(
                `/members/workspace/${workspaceId}`,
                form
            );


            refresh();
            closeModal();


        }
        catch (error) {

            console.log(
                error.response?.data
            );

        }

    }



    return (

        <div className="modal-backdrop">

            <div className="task-modal">


                <h2>
                    Invite Member
                </h2>



                <form onSubmit={submit}>


                    <select

                        required

                        value={form.user_id}

                        onChange={
                            e => setForm({
                                ...form,
                                user_id: e.target.value
                            })
                        }

                    >

                        <option value="">
                            Select User
                        </option>


                        {
                            users.map(user => (

                                <option
                                    key={user.id}
                                    value={user.id}
                                >

                                    {user.name} ({user.email})

                                </option>

                            ))
                        }


                    </select>



                    <select

                        value={form.role}

                        onChange={
                            e => setForm({
                                ...form,
                                role: e.target.value
                            })
                        }

                    >

                        <option value="MEMBER">
                            Member
                        </option>

                        <option value="ADMIN">
                            Admin
                        </option>

                    </select>




                    <button className="primary-btn">

                        Invite

                    </button>


                    <button
                        type="button"
                        onClick={closeModal}
                    >

                        Cancel

                    </button>



                </form>


            </div>

        </div>

    );


}


export default InviteMemberModal;