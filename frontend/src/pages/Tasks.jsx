import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import TaskCard from "../components/TaskCard";

import { useSearchParams } from "react-router-dom";

function Tasks() {
    const { projectId, workspaceId } = useParams();
    const [tasks, setTasks] = useState([]);

    const [searchParams] = useSearchParams();
    const status = searchParams.get("status");

    useEffect(() => {
        if (projectId || workspaceId) {
            loadTasks();
        }
    }, [projectId, workspaceId]);
    if (!projectId && !workspaceId) {
        return <h2>No project selected</h2>;
    }

    async function loadTasks() {
        try {
            let res;
            if (projectId) {
                res = await api.get(
                    `/tasks/project/${projectId}`
                );
            }
            else if (workspaceId) {
                res = await api.get(
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

        </div>
    );
}

export default Tasks;