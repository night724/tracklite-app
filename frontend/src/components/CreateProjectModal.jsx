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

                <div className="modal-header">

                    <div>
                        <h2>
                            Create New Project
                        </h2>

                        <p>
                            Organize your work and collaborate with your team
                        </p>
                    </div>


                    <button
                        type="button"
                        className="close-btn"
                        onClick={closeModal}
                    >
                        ✕
                    </button>

                </div>


                <form
                    className="project-form"
                    onSubmit={submitProject}
                >

                    <div className="form-group">

                        <label>
                            Project Name
                        </label>

                        <input
                            name="name"
                            placeholder="e.g. Website Redesign"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                    </div>



                    <div className="form-group">

                        <label>
                            Description
                        </label>

                        <textarea

                            name="description"

                            placeholder="Describe your project..."

                            value={form.description}

                            onChange={handleChange}

                        />

                    </div>



                    <div className="project-preview">

                        <div className="preview-icon">
                            📁
                        </div>

                        <div>

                            <h3>
                                {
                                    form.name ||
                                    "Project name"
                                }
                            </h3>

                            <p>
                                {
                                    form.description ||
                                    "No description yet"
                                }
                            </p>

                        </div>

                    </div>



                    <div className="modal-actions">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={closeModal}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
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