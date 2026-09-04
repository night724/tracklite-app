import { Link } from 'react-router-dom';
import api from '../api/client';
import { useState } from 'react';
import DeleteConfirmModal from './DeleteConfirmModal';

function TaskCard({ task, refresh }) {
    const [showDelete, setShowDelete] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    async function deleteTask() {
        try {
            setLoading(true);

            await api.delete(`/tasks/${task.id}`);

            refresh();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            setShowDelete(false);
        }
    }

    return (
        <div className="task-card">
            <div className="task-card-header">
                <h3>{task.title}</h3>

                <span className={`priority ${task.priority?.toLowerCase()}`}>
                    {task.priority}
                </span>
            </div>

            <p>{task.description || 'No description'}</p>

            <div className="task-info">
                <div>
                    <span>Status</span>

                    <strong>{task.status}</strong>
                </div>

                <div>
                    <span>Assigned</span>

                    <strong>{task.assigned_name || 'Unassigned'}</strong>
                </div>
            </div>

            <div className="task-actions">
                <Link to={`/tasks/${task.id}`} className="view-task-btn">
                    View Task →
                </Link>

                <button
                    className="delete-task-btn"
                    onClick={() => setShowDelete(true)}
                >
                    Delete
                </button>
            </div>
            {showDelete && (
                <DeleteConfirmModal
                    title="Delete Task?"

                    message="Are you sure you want to delete this task?"

                    onConfirm={deleteTask}

                    onCancel={() => setShowDelete(false)}

                    loading={loading}
                />
            )}
        </div>
    );
}

export default TaskCard;
