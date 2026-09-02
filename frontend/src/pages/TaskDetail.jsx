import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client";
import CreateIssueModal from "../components/CreateIssueModal";

function TaskDetail() {
    const { id } = useParams();
    const [issues, setIssues] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [task, setTask] = useState(null);

    useEffect(() => { loadTask(); }, []);

    async function loadTask() {
        try {
            const taskRes =
                await api.get(
                    `/tasks/${id}`
                );
            const issueRes =
                await api.get(
                    `/issues/task/${id}`
                );
            setTask(taskRes.data);
            setIssues(issueRes.data);
        }
        catch (error) {

            console.log(error);
        }
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
                <button
                    className="primary-btn"
                    onClick={() =>
                        setShowModal(true)
                    }
                >
                    + New Issue
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
            <div className="task-section">
                <h2>
                    Issues
                </h2>
                {
                    issues.length === 0 ?
                        (
                            <div className="empty-box">
                                No issues yet.
                                <br />
                                Create your first issue.
                            </div>
                        )
                        :
                        (
                            <div className="issue-list">

                                {
                                    issues.map(issue => (

                                        <Link
                                            key={issue.id}
                                            to={`/issues/${issue.id}`}
                                            className="issue-card"
                                        >


                                            <div className="issue-card-header">


                                                <div className="issue-id">
                                                    🐞 {issue.issue_key}
                                                </div>


                                                <span
                                                    className={
                                                        `priority ${issue.priority?.toLowerCase()}`
                                                    }
                                                >
                                                    {issue.priority}
                                                </span>


                                            </div>



                                            <h3>
                                                {issue.title}
                                            </h3>



                                            <p>
                                                {
                                                    issue.description ||
                                                    "No description"
                                                }
                                            </p>




                                            <div className="issue-card-footer">


                                                <span>
                                                    👤 {task.created_by || "User"}
                                                </span>


                                                <span className="issue-status">
                                                    {issue.status}
                                                </span>


                                            </div>


                                        </Link>


                                    ))

                                }

                            </div>
                        )
                }
            </div>
            {
                showModal && (
                    <CreateIssueModal
                        taskId={id}
                        closeModal={() =>
                            setShowModal(false)
                        }
                        refresh={loadTask}
                    />
                )
            }
        </div>
    );
}

export default TaskDetail;