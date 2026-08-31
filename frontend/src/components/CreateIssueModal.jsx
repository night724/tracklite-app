import { useState, useEffect } from "react";
import api from "../api/client";


function CreateIssueModal({
    projectId,
    closeModal,
    refresh
}) {

    const [tasks, setTasks] = useState([]);


    useEffect(() => {

        async function loadTasks() {

            try {

                const res =
                    await api.get(
                        `/tasks/project/${projectId}`
                    );

                setTasks(res.data);

            }
            catch (error) {

                console.log(error);

            }

        }


        loadTasks();

    }, [projectId]);
    const [form, setForm] = useState({

        task_id: "",
        title: "",
        description: "",
        priority: "MEDIUM"

    });


    function handleChange(e) {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    }




    async function submitIssue(e) {

        e.preventDefault();


        try {


            await api.post(
                "/issues",
                form
            );


            refresh();

            closeModal();


        }

        catch (error) {

            console.log(error);

        }


    }





    return (

        <div className="modal-overlay">


            <div className="issue-modal">


                <h2>
                    Create Issue
                </h2>



                <form onSubmit={submitIssue}>


                    <input

                        name="title"

                        placeholder="Issue title"

                        value={form.title}

                        onChange={handleChange}

                        required

                    />




                    <textarea

                        name="description"

                        placeholder="Description"

                        value={form.description}

                        onChange={handleChange}

                    />





                    <select

                        name="priority"

                        value={form.priority}

                        onChange={handleChange}

                    >


                        <option value="HIGH">
                            High
                        </option>


                        <option value="MEDIUM">
                            Medium
                        </option>


                        <option value="LOW">
                            Low
                        </option>


                    </select>


                    <select

                        name="task_id"

                        value={form.task_id}

                        onChange={handleChange}

                        required

                    >

                        <option value="">
                            Select Task
                        </option>


                        {
                            tasks.map(task => (

                                <option

                                    key={task.id}

                                    value={task.id}

                                >

                                    {task.title}

                                </option>

                            ))
                        }


                    </select>


                    <div className="modal-actions">


                        <button

                            type="button"

                            onClick={closeModal}

                            className="cancel-btn"

                        >

                            Cancel

                        </button>



                        <button

                            className="primary-btn"

                        >

                            Create Issue

                        </button>



                    </div>



                </form>



            </div>


        </div>


    );


}


export default CreateIssueModal;