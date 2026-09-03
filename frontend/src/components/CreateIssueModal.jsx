import { useState } from 'react';
import api from '../api/client';

function CreateIssueModal({ taskId, closeModal, refresh }) {
    const [form, setForm] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
    });

    function handleChange(e) {
        setForm({
            ...form,

            [e.target.name]: e.target.value,
        });
    }

    async function submitIssue(e) {
        e.preventDefault();

        try {
            await api.post(
                '/issues',

                {
                    task_id: taskId,

                    title: form.title,

                    description: form.description,

                    priority: form.priority,
                },
            );

            await refresh();

            closeModal();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="issue-modal">
                <h2>Create Issue</h2>

                <form onSubmit={submitIssue}>
                    <input
                        name="title"

                        placeholder="Issue title"

                        value={form.title}

                        onChange={handleChange}

                        required
                    />

                    <textarea
                        name="description"

                        placeholder="Description"

                        value={form.description}

                        onChange={handleChange}
                    />

                    <select
                        name="priority"

                        value={form.priority}

                        onChange={handleChange}
                    >
                        <option value="HIGH">High</option>

                        <option value="MEDIUM">Medium</option>

                        <option value="LOW">Low</option>
                    </select>

                    <div className="modal-actions">
                        <button
                            type="button"

                            onClick={closeModal}

                            className="cancel-btn"
                        >
                            Cancel
                        </button>

                        <button className="primary-btn">Create Issue</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateIssueModal;
