import { useState } from 'react';
import api from '../api/client';

function EditTaskModal({ task, closeModal, refresh }) {
    const [form, setForm] = useState({
        title: task.title || '',

        description: task.description || '',

        status: task.status || 'TODO',

        priority: task.priority || 'MEDIUM',

        assigned_to: task.assigned_to || null,

        due_date: task.due_date || '',
    });

    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({
            ...form,

            [e.target.name]: e.target.value,
        });
    }

    async function updateTask() {
        try {
            setLoading(true);

            await api.patch(`/tasks/${task.id}`, {
                title: form.title,
                description: form.description,
                status: form.status,
                priority: form.priority,
                assigned_to: form.assigned_to,
                due_date: form.due_date || null,
            });

            refresh();

            closeModal();
        } catch (error) {
            console.log('UPDATE TASK ERROR:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <h2>Edit Task</h2>

                <div className="form-group">
                    <label>Title</label>

                    <input
                        name="title"

                        value={form.title}

                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>

                    <textarea
                        name="description"

                        value={form.description}

                        onChange={handleChange}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Status</label>

                        <select
                            name="status"

                            value={form.status}

                            onChange={handleChange}
                        >
                            <option value="TODO">TODO</option>

                            <option value="IN_PROGRESS">IN PROGRESS</option>

                            <option value="DONE">DONE</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Priority</label>

                        <select
                            name="priority"

                            value={form.priority}

                            onChange={handleChange}
                        >
                            <option value="LOW">LOW</option>

                            <option value="MEDIUM">MEDIUM</option>

                            <option value="HIGH">HIGH</option>

                            <option value="URGENT">URGENT</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Due Date</label>

                    <input
                        type="date"

                        name="due_date"

                        value={form.due_date ? form.due_date.slice(0, 10) : ''}

                        onChange={handleChange}
                    />
                </div>

                <div className="modal-actions">
                    <button
                        className="cancel-btn"

                        onClick={closeModal}

                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        className="primary-btn"

                        onClick={updateTask}

                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditTaskModal;
