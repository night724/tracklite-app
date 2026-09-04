import { useState } from 'react';
import api from '../api/client';

function EditIssueModal({ issue, closeModal, refresh }) {
    const [form, setForm] = useState({
        title: issue.title || '',

        description: issue.description || '',

        status: issue.status || 'OPEN',

        priority: issue.priority || 'MEDIUM',

        assigned_to: issue.assigned_to || null,
    });

    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({
            ...form,

            [e.target.name]: e.target.value,
        });
    }

    async function updateIssue() {
        try {
            setLoading(true);

            await api.patch(`/issues/${issue.id}`, {
                title: form.title,
                description: form.description,
                status: form.status,
                priority: form.priority,
                assigned_to: form.assigned_to,
            });

            refresh();

            closeModal();
        } catch (error) {
            console.log('UPDATE ISSUE ERROR:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <h2>Edit Issue</h2>

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
                        <label>Priority</label>

                        <select
                            name="priority"

                            value={form.priority}

                            onChange={handleChange}
                        >
                            <option value="LOW">LOW</option>

                            <option value="MEDIUM">MEDIUM</option>

                            <option value="HIGH">HIGH</option>
                        </select>
                    </div>
                </div>

                <div className="modal-actions">
                    <button
                        className="cancel-btn"

                        onClick={closeModal}
                    >
                        Cancel
                    </button>

                    <button
                        className="primary-btn"

                        disabled={loading}

                        onClick={updateIssue}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditIssueModal;
