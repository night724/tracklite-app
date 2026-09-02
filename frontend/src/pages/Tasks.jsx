import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import api from "../api/client";
import CreateTaskModal from "../components/CreateTaskModal";


function Tasks() {


    const { projectId, workspaceId } = useParams();

    const [tasks, setTasks] = useState([]);

    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [searchParams] = useSearchParams();

    const statusFilter =
        searchParams.get("status");



    useEffect(() => {

        loadTasks();

    }, [projectId, workspaceId, statusFilter]);




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
            title: "📝 To Do",
            status: "TODO"
        },

        {
            title: "🚀 In Progress",
            status: "IN_PROGRESS"
        },

        {
            title: "✅ Completed",
            status: "DONE"
        }

    ];

    const visibleColumns =
        statusFilter
            ? columns.filter(
                column =>
                    column.status === statusFilter
            )
            : columns;


    return (

        <div className="tasks-page">


            <div className="tasks-header">


                <div>

                    <h1>
                        Tasks
                    </h1>


                    <p>
                        Manage your project workflow
                    </p>

                </div>



                {
                    projectId &&

                    <button
                        className="primary-btn"
                        onClick={() =>
                            setShowModal(true)
                        }
                    >
                        + New Task
                    </button>

                }


            </div>





            <div className="task-search">


                🔍

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
                    visibleColumns.map(column => (


                        <div
                            className="kanban-column"
                            key={column.status}
                        >



                            <div className="column-title">


                                <h3>
                                    {column.title}
                                </h3>


                                <span>

                                    {
                                        tasks.filter(
                                            t =>
                                                t.status === column.status &&
                                                (!statusFilter || t.status === statusFilter)
                                        ).length
                                    }

                                </span>


                            </div>







                            {

                                tasks

                                    .filter(task => {

                                        const searchMatch =
                                            task.title
                                                .toLowerCase()
                                                .includes(
                                                    search.toLowerCase()
                                                );


                                        const statusMatch =
                                            !statusFilter ||
                                            task.status === statusFilter;


                                        return (
                                            task.status === column.status &&
                                            searchMatch &&
                                            statusMatch
                                        );

                                    })

                                    .map(task => (


                                        <Link

                                            key={task.id}

                                            to={`/tasks/${task.id}`}

                                            className={`task-card ${task.priority?.toLowerCase()}`}

                                        >


                                            <div className="task-card-top">


                                                <span className="task-priority">

                                                    {task.priority}

                                                </span>


                                                <span className="task-status">

                                                    {task.status}

                                                </span>


                                            </div>




                                            <h3>

                                                {task.title}

                                            </h3>



                                            <p>

                                                {
                                                    task.description ||
                                                    "No description"
                                                }

                                            </p>




                                            <div className="task-card-footer">


                                                <span>

                                                    👤 Assigned

                                                </span>


                                                <span>

                                                    →
                                                </span>


                                            </div>


                                        </Link>


                                    ))

                            }



                        </div>


                    ))
                }


            </div>







            {
                showModal &&

                <CreateTaskModal

                    projectId={projectId}

                    closeModal={() =>
                        setShowModal(false)
                    }

                    refresh={loadTasks}

                />

            }


        </div>

    );

}


export default Tasks;