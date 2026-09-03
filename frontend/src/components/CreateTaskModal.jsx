import { useState } from 'react';
import api from '../api/client';
function CreateTaskModal({ projectId, closeModal, refresh }) {
    const [form, setForm] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
        status: 'TODO',
    });
    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }
    async function submitTask(e) {
        e.preventDefault();
        try {
            await api.post('/tasks', {
                project_id: projectId,
                title: form.title,
                description: form.description,
                priority: form.priority,
                status: form.status,
            });
            refresh();
            closeModal();
        } catch (error) {
            console.log('CREATE TASK ERROR:', error);
        }
    }

    return (
        <div className="modal-backdrop">
            <div className="task-modal">
                <div className="modal-header">
                    <div>
                        <h2>Create New Task</h2>
                        <p>Add a task to this project</p>
                    </div>
                    <button className="close-btn" onClick={closeModal}>
                        ×
                    </button>
                </div>
                <form onSubmit={submitTask}>
                    <div className="form-group">
                        <label>Task Title</label>
                        <input
                            name="title"
                            placeholder="Example: Build login page"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            placeholder="Describe the task..."
                            value={form.description}
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Priority</label>
                            <select
                                name="priority"
                                value={form.priority}
                                onChange={handleChange}
                            >
                                <option value="HIGH">🔴 High</option>
                                <option value="MEDIUM">🟡 Medium</option>
                                <option value="LOW">🟢 Low</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="TODO">Todo</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Done</option>
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={closeModal}
                        >
                            Cancel
                        </button>
                        <button className="primary-btn">Create Task</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default CreateTaskModal;
