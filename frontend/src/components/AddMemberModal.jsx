import { useEffect, useState } from "react";
import api from "../api/client";


function AddMemberModal({
    projectId,
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
                    `/members/workspace/${workspaceId}`
                );

            setUsers(res.data);

        }
        catch (error) {

            console.log(error);

        }

    }



    function handleChange(e) {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    }



    async function submit(e) {

        e.preventDefault();

        try {

            await api.post(
                `/members/project/${projectId}`,
                form
            );


            refresh();
            closeModal();

        }
        catch (error) {

            console.log(
                "ADD MEMBER ERROR:",
                error.response?.data
            );

        }

    }



    return (

        <div className="modal-backdrop">

            <div className="task-modal">


                <div className="modal-header">

                    <h2>
                        Add Member
                    </h2>


                    <button
                        className="close-btn"
                        onClick={closeModal}
                    >
                        ×
                    </button>

                </div>



                <form onSubmit={submit}>


                    <div className="form-group">

                        <label>
                            Select User
                        </label>


                        <select
                            name="user_id"
                            value={form.user_id}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select member
                            </option>


                            {
                                users.map(user => (

                                    <option
                                        key={user.user_id}
                                        value={user.user_id}
                                    >
                                        {user.name} ({user.email})
                                    </option>

                                ))
                            }


                        </select>


                    </div>



                    <div className="form-group">

                        <label>
                            Role
                        </label>


                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                        >

                            <option value="MEMBER">
                                Member
                            </option>

                            <option value="ADMIN">
                                Admin
                            </option>


                        </select>

                    </div>



                    <div className="modal-footer">


                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={closeModal}
                        >
                            Cancel
                        </button>


                        <button
                            className="primary-btn"
                        >
                            Add Member
                        </button>


                    </div>


                </form>


            </div>

        </div>

    );

}


export default AddMemberModal;