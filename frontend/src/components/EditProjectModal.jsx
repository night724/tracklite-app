import { useState } from 'react';
import api from '../api/client';

function EditProjectModal({ project, closeModal, refresh }) {
    const [form, setForm] = useState({
        name: project.name || '',

        description: project.description || '',

        status: project.status || 'ACTIVE',
    });

    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({
            ...form,

            [e.target.name]: e.target.value,
        });
    }

    async function updateProject() {
        try {
            setLoading(true);

            await api.patch(
                `/projects/${project.id}`,

                form,
            );

            refresh();

            closeModal();
        } catch (error) {
            console.log('UPDATE PROJECT ERROR:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <h2>Edit Project</h2>

                <div className="form-group">
                    <label>Project Name</label>

                    <input
                        name="name"

                        value={form.name}

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

                <div className="form-group">
                    <label>Status</label>

                    <select
                        name="status"

                        value={form.status}

                        onChange={handleChange}
                    >
                        <option value="ACTIVE">ACTIVE</option>

                        <option value="COMPLETED">COMPLETED</option>

                        <option value="ARCHIVED">ARCHIVED</option>
                    </select>
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

                        onClick={updateProject}

                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditProjectModal;
