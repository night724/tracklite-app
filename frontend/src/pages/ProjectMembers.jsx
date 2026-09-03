import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import AddMemberModal from '../components/AddMemberModal';

function ProjectMembers() {
    const { projectId } = useParams();

    const [members, setMembers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [project, setProject] = useState(null);
    useEffect(() => {
        loadMembers();
        loadProject();
    }, [projectId]);

    async function loadMembers() {
        try {
            const res = await api.get(`/members/project/${projectId}`);

            setMembers(res.data);
        } catch (error) {
            console.log(error);
        }
    }
    async function loadProject() {
        try {
            const res = await api.get(`/projects/${projectId}`);

            setProject(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="members-page">
            <div className="page-header">
                <div>
                    <h1>Project Members</h1>

                    <p>People working on this project</p>
                </div>
                <button
                    className="primary-btn"
                    onClick={() => setShowModal(true)}
                >
                    + Invite Member
                </button>
            </div>

            <div className="members-grid">
                {members.map((member) => (
                    <div className="member-card" key={member.id}>
                        <span
                            className={`role-badge ${member.role.toLowerCase()}`}
                        >
                            {member.role}
                        </span>

                        <div className="member-avatar">
                            {member.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="member-info">
                            <h3>{member.name}</h3>

                            <p>{member.email}</p>

                            <div className="member-task-status">
                                <div className="task-stat total">
                                    <span className="stat-icon">📋</span>

                                    <div className="stat-item">
                                        <strong>{member.total_tasks}</strong>
                                        <span>Tasks</span>
                                    </div>
                                </div>

                                <div className="task-stat completed">
                                    <span className="stat-icon">✓</span>

                                    <div className="stat-item">
                                        <strong>
                                            {member.completed_tasks}
                                        </strong>
                                        <span>Done</span>
                                    </div>
                                </div>

                                <div className="task-stat working">
                                    <span className="stat-icon">⚡</span>

                                    <div className="stat-item">
                                        <strong>{member.progress_tasks}</strong>
                                        <span>Working</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <AddMemberModal
                    projectId={projectId}

                    workspaceId={project.workspace_id}

                    closeModal={() => setShowModal(false)}

                    refresh={loadMembers}
                />
            )}
        </div>
    );
}

export default ProjectMembers;
