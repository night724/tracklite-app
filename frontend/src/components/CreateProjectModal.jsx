import { useState } from "react";
import api from "../api/client";


function CreateProjectModal({
    workspaceId,
    closeModal,
    refresh
}) {


    const [form, setForm] = useState({

        name: "",
        description: ""

    });



    function handleChange(e) {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    }



    async function submitProject(e) {

        e.preventDefault();


        try {


            await api.post(
                "/projects",
                {
                    workspace_id: workspaceId,
                    name: form.name,
                    description: form.description
                }
            );


            await refresh();

            closeModal();


        }
        catch (error) {

            console.log(error);

        }

    }



    return (

        <div className="modal-overlay">


            <div className="project-modal">


                <h2>
                    Create Project
                </h2>



                <form onSubmit={submitProject}>


                    <input

                        name="name"

                        placeholder="Project name"

                        value={form.name}

                        onChange={handleChange}

                        required

                    />



                    <textarea

                        name="description"

                        placeholder="Project description"

                        value={form.description}

                        onChange={handleChange}

                    />



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

                        >

                            Create Project

                        </button>


                    </div>


                </form>


            </div>


        </div>

    );

}


export default CreateProjectModal;