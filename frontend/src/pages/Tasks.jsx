import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import TaskCard from "../components/TaskCard";
import CreateTaskModal from "../components/CreateTaskModal";

function Tasks() {
    const { projectId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => { loadTasks(); }, []);

    async function loadTasks() {
        try {
            const res = await api.get(`/tasks/project/${projectId}`);
            setTasks(res.data);
        }
        catch (error) {
            console.log(error);
        }
    }
    const columns = [
        {
            title: "TODO",
            status: "TODO"
        },
        {
            title: "IN PROGRESS",
            status: "IN_PROGRESS"
        },
        {
            title: "DONE",
            status: "DONE"
        }
    ];

    return (
        <div className="tasks-page">
            <div className="page-header">
                <div>
                    <h1>
                        Tasks
                    </h1>
                    <p>
                        Manage project workflow
                    </p>
                </div>
                <button
                    className="primary-btn"
                    onClick={() => setShowModal(true)}
                >
                    + New Task
                </button>
            </div>
            <div className="kanban-board">
                {
                    columns.map(column => (
                        <div
                            className="kanban-column"
                            key={column.status}
                        >
                            <div className="kanban-header">
                                <h3>
                                    {column.title}
                                </h3>
                                <span>
                                    {
                                        tasks.filter(
                                            task => task.status === column.status
                                        ).length
                                    }
                                </span>
                            </div>
                            {
                                tasks
                                    .filter(
                                        task => task.status === column.status
                                    )
                                    .map(task => (
                                        <Link
                                            key={task.id}
                                            to={`/tasks/${task.id}`}
                                            className="kanban-card"
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
                                            <div className="task-meta">
                                                <span>
                                                    {task.priority}
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
                showModal && (
                    <CreateTaskModal
                        projectId={projectId}
                        closeModal={() =>
                            setShowModal(false)
                        }
                        refresh={loadTasks}
                    />
                )
            }
        </div>
    );
}

export default Tasks;