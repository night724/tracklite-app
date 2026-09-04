import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/client';
import CreateIssueModal from '../components/CreateIssueModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import EditTaskModal from '../components/EditTaskModal';

function TaskDetail() {
    const { id } = useParams();
    const [issues, setIssues] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [task, setTask] = useState(null);

    useEffect(() => {
        if (id) {
            loadTask();
        }
    }, [id]);

    async function loadTask() {
        try {
            const taskRes = await api.get(`/tasks/${id}`);
            const issueRes = await api.get(`/issues/task/${id}`);
            setTask(taskRes.data);
            setIssues(issueRes.data);
        } catch (error) {
            console.log(error);
        }
    }
    const [showDelete, setShowDelete] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    async function deleteTask() {
        try {
            setDeleteLoading(true);

            await api.delete(`/tasks/${id}`);

            window.history.back();
        } catch (error) {
            console.log(error);
        } finally {
            setDeleteLoading(false);
            setShowDelete(false);
        }
    }
    if (!task) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="task-detail">
            <div className="task-header">
                <div>
                    <h1>{task.title}</h1>
                    <p>{task.description || 'No description'}</p>
                </div>
                <div className="task-actions">
                    <button
                        className="primary-btn"
                        onClick={() => setShowModal(true)}
                    >
                        + New Issue
                    </button>

                    <button
                        className="edit-btn"
                        onClick={() => setShowEdit(true)}
                    >
                        ✏ Edit
                    </button>

                    <button
                        className="delete-btn"
                        onClick={() => setShowDelete(true)}
                    >
                        🗑 Delete
                    </button>
                </div>
            </div>

            <div className="task-info-grid">
                <div>
                    <label>Status</label>
                    <strong>{task.status}</strong>
                </div>
                <div>
                    <label>Priority</label>
                    <strong>{task.priority}</strong>
                </div>

                <div>
                    <label>Created By</label>
                    <strong>{task.created_by || 'User'}</strong>
                </div>
                <div>
                    <label>Due Date</label>
                    <strong>{task.due_date || '-'}</strong>
                </div>
            </div>
            <div className="task-section">
                <h2>Issues</h2>
                {issues.length === 0 ? (
                    <div className="empty-box">
                        No issues yet.
                        <br />
                        Create your first issue.
                    </div>
                ) : (
                    <div className="issue-list">
                        {issues.map((issue) => (
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
                                        className={`priority ${issue.priority?.toLowerCase()}`}
                                    >
                                        {issue.priority}
                                    </span>
                                </div>

                                <h3>{issue.title}</h3>

                                <p>{issue.description || 'No description'}</p>

                                <div className="issue-card-footer">
                                    <span>👤 {task.created_by || 'User'}</span>

                                    <span className="issue-status">
                                        {issue.status}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            {showModal && (
                <CreateIssueModal
                    taskId={id}
                    closeModal={() => setShowModal(false)}
                    refresh={loadTask}
                />
            )}
            {showDelete && (
                <DeleteConfirmModal
                    title="Delete Task?"

                    message="This action cannot be undone. This task and related data will be deleted."

                    onConfirm={deleteTask}

                    onCancel={() => setShowDelete(false)}

                    loading={deleteLoading}
                />
            )}
            {showEdit && (
                <EditTaskModal
                    task={task}

                    closeModal={() => setShowEdit(false)}

                    refresh={loadTask}
                />
            )}
        </div>
    );
}

export default TaskDetail;
