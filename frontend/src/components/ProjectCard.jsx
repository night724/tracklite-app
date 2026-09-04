import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/client';
import DeleteConfirmModal from './DeleteConfirmModal';

function ProjectCard({ project, refresh }) {
    console.log('PROJECT DATA:', project);
    const progress = project.progress || 0;
    const [showDelete, setShowDelete] = useState(false);
    const [loading, setLoading] = useState(false);

    async function deleteProject() {
        try {
            setLoading(true);

            await api.delete(`/projects/${project.id}`);

            refresh();

            setShowDelete(false);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="project-card">
            {/* HEADER */}

            <div className="project-card-header">
                <div className="project-icon">
                    {project.name?.charAt(0).toUpperCase()}
                </div>

                <div className="project-info">
                    <h2>{project.name}</h2>

                    <span
                        className={`status-badge ${project.status?.toLowerCase()}`}
                    >
                        {project.status || 'ACTIVE'}
                    </span>
                </div>
            </div>

            {/* DESCRIPTION */}

            <p className="project-description">
                {project.description || 'No description available'}
            </p>

            {/* STATS */}

            <div className="project-stat-container">
                <div className="project-stat">
                    <strong>{project.taskCount || 0}</strong>

                    <span>Tasks</span>
                </div>

                <div className="project-stat">
                    <strong>{project.memberCount || 0}</strong>

                    <span>Members</span>
                </div>

                <div className="project-stat">
                    <strong>{project.issueCount || 0}</strong>
                    <span>Issues</span>
                </div>
            </div>

            <div className="project-progress">
                <div className="progress-top">
                    <span>Progress</span>
                    <strong>{progress}% Complete</strong>
                </div>

                <div className="progress-track">
                    <div
                        className="progress-value"

                        style={{
                            width: `${progress}%`,
                        }}
                    />
                </div>
                <p className="progress-text">
                    {project.completedTasks || 0}/{project.taskCount || 0}
                    tasks completed
                </p>
                <div className="project-team-status">
                    <div>
                        <span>👥</span>
                        <strong>{project.memberCount || 0}</strong>
                        <small>Members</small>
                    </div>

                    <div>
                        <span>✅</span>
                        <strong>{project.completedTasks || 0}</strong>
                        <small>Done</small>
                    </div>

                    <div>
                        <span>🔄</span>
                        <strong>{project.activeTasks || 0}</strong>
                        <small>Active</small>
                    </div>
                </div>
            </div>

            <div className="project-actions">
                <Link
                    to={`/projects/${project.id}`}
                    onClick={() => {
                        console.log('CLICK PROJECT:', project.id);
                    }}
                    className="project-action"
                >
                    Open Project →
                </Link>

                <button
                    className="delete-project-btn"
                    onClick={() => {
                        setShowDelete(true);
                    }}
                >
                    Delete
                </button>
            </div>
            {showDelete && (
                <DeleteConfirmModal
                    title="Delete Project?"

                    message="This action cannot be undone. All tasks, issues and comments will be deleted."

                    onConfirm={deleteProject}

                    onCancel={() => {
                        setShowDelete(false);
                    }}

                    loading={loading}
                />
            )}
        </div>
    );
}

export default ProjectCard;
