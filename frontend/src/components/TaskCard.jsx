import { Link } from 'react-router-dom';

function TaskCard({ task }) {
    return (
        <div className="task-card">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <div>
                Status:
                <strong>{task.status}</strong>
            </div>
            <div>
                Priority:
                <strong>{task.priority}</strong>
            </div>
            <div>
                Assigned:
                <strong>{task.assigned_name || 'Unassigned'}</strong>
            </div>
            <Link to={`/tasks/${task.id}`}>View Task</Link>
        </div>
    );
}

export default TaskCard;
