import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client";

function TaskDetail() {
    const { id } = useParams();
    const [task, setTask] = useState(null);

    useEffect(() => { loadTask(); }, []);

    async function loadTask() {
        const res = await api.get(`/tasks/${id}`);
        setTask(res.data);
    }

    if (!task) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="task-detail">
            <div className="task-header">
                <div>
                    <h1>
                        {task.title}
                    </h1>
                    <p>
                        {
                            task.description ||
                            "No description"
                        }
                    </p>
                </div>
                <button className="primary-btn">
                    + Create Issue
                </button>
            </div>

            <div className="task-info-grid">
                <div>
                    <label>
                        Status
                    </label>
                    <strong>
                        {task.status}
                    </strong>
                </div>
                <div>
                    <label>
                        Priority
                    </label>
                    <strong>
                        {task.priority}
                    </strong>
                </div>

                <div>
                    <label>
                        Created By
                    </label>
                    <strong>
                        {task.created_by || "User"}
                    </strong>
                </div>
                <div>
                    <label>
                        Due Date
                    </label>
                    <strong>
                        {task.due_date || "-"}
                    </strong>
                </div>

            </div>

            <div className="task-content">

                <div className="task-section">
                    <h2>
                        Issues
                    </h2>

                    <div className="empty-box">
                        No issues yet.
                        <br />
                        Create your first issue.
                    </div>

                </div>

                <div className="task-section">

                    <h2>
                        Activity
                    </h2>

                    <div className="activity-row">

                        ✓ Task created

                    </div>

                    <div className="activity-row">

                        ⚡ Task updated

                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskDetail;