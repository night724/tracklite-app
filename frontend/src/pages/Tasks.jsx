import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";


function Tasks() {

    const { projectId, workspaceId } = useParams();

    const [tasks, setTasks] = useState([]);

    const [search, setSearch] = useState("");



    useEffect(() => {

        if (projectId || workspaceId) {
            loadTasks();
        }

    }, [projectId, workspaceId]);



    async function loadTasks() {

        try {

            let res;

            if (projectId) {

                res =
                    await api.get(
                        `/tasks/project/${projectId}`
                    );

            }
            else {

                res =
                    await api.get(
                        `/tasks/workspace/${workspaceId}`
                    );

            }


            setTasks(res.data);


        }
        catch (error) {

            console.log(error);

        }

    }





    const columns = [

        {
            title: "To Do",
            status: "TODO"
        },

        {
            title: "In Progress",
            status: "IN_PROGRESS"
        },

        {
            title: "Completed",
            status: "DONE"
        }

    ];




    return (

        <div className="tasks-page">



            <div className="tasks-header">


                <div>

                    <h1>
                        Tasks
                    </h1>

                    <p>
                        Track and manage your project workflow
                    </p>

                </div>



                <button className="primary-btn">

                    + New Task

                </button>


            </div>





            <div className="task-toolbar">


                <input

                    placeholder="Search tasks..."

                    value={search}

                    onChange={
                        e => setSearch(e.target.value)
                    }

                />


            </div>







            <div className="kanban-board">


                {
                    columns.map(column => (


                        <div
                            className="kanban-column"
                            key={column.status}
                        >



                            <div className="column-header">


                                <h3>
                                    {column.title}
                                </h3>


                                <span>

                                    {
                                        tasks.filter(
                                            t =>
                                                t.status === column.status
                                        ).length
                                    }

                                </span>


                            </div>





                            {

                                tasks

                                    .filter(task =>

                                        task.status === column.status &&

                                        task.title
                                            .toLowerCase()
                                            .includes(
                                                search.toLowerCase()
                                            )

                                    )

                                    .map(task => (


                                        <Link

                                            key={task.id}

                                            to={`/tasks/${task.id}`}

                                            className="task-item"

                                        >



                                            <h4>

                                                {task.title}

                                            </h4>



                                            <p>

                                                {
                                                    task.description ||
                                                    "No description"
                                                }

                                            </p>




                                            <div className="task-footer">


                                                <span
                                                    className={
                                                        `priority ${task.priority?.toLowerCase()}`
                                                    }
                                                >

                                                    {task.priority}

                                                </span>



                                                <span>

                                                    👤

                                                </span>


                                            </div>



                                        </Link>


                                    ))

                            }



                        </div>


                    ))
                }


            </div>




        </div>

    );

}


export default Tasks;