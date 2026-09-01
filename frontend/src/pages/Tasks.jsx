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
    const statusFilter = searchParams.get("status");
    useEffect(() => {

        if (projectId || workspaceId) {
            loadTasks();
        }

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
                        `/tasks/workspace/${workspaceId}?status=${statusFilter || ""}`
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
    const displayColumns =
        statusFilter === "DONE"
            ? [
                {
                    title: "Completed",
                    status: "DONE"
                }
            ]
            : columns;
    return (
        <div className="tasks-page">
            <div className="tasks-header">
                <div>
                    <h1>
                        {
                            statusFilter === "DONE"
                                ? "Completed Tasks"
                                : "Tasks"
                        }
                    </h1>
                    <p>
                        Track and manage your project workflow
                    </p>
                </div>
                {
                    projectId && (
                        <button
                            className="primary-btn"
                            onClick={() => setShowModal(true)}
                        >
                            + New Task
                        </button>
                    )
                }
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
                    displayColumns.map(column => (
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