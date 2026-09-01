import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client";
import CreateTaskModal from "../components/CreateTaskModal";

function ProjectDetail() {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        loadProject();
    }, []);

    async function loadProject() {
        try {
            const res = await api.get(`/projects/${projectId}`);
            setProject(res.data);
        }
        catch (error) {
            console.log(error);
        }
    }
    if (!project) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="project-detail">
            <div className="project-banner">
                <div>
                    <h1>
                        {project.name}
                    </h1>
                    <p>
                        {
                            project.description ||
                            "No project description"
                        }
                    </p>
                </div>
                <span className="project-status">
                    {project.status || "ACTIVE"}
                </span>
            </div>

            <div className="project-actions">
                <Link
                    to={`/projects/${project.id}/tasks`}
                    className="action-btn"
                >
                    Tasks
                </Link>
                <Link
                    to={`/projects/${projectId}/issues`}
                    className="action-btn"
                >
                    Issues
                </Link>
                <button
                    className="primary-btn"
                    onClick={() => setShowModal(true)}
                >
                    + Add Task
                </button>
            </div>
            <div className="project-stats">
                <div>
                    <h2>
                        12
                    </h2>
                    <p>
                        Tasks
                    </p>
                </div>
                <div>
                    <h2>
                        8
                    </h2>
                    <p>
                        Issues
                    </p>
                </div>
                <div>
                    <h2>
                        5
                    </h2>
                    <p>
                        Members
                    </p>
                </div>
            </div>
            <div className="project-section">
                <h2>
                    Recent Activity
                </h2>
                <div className="activity-item">
                    <span>
                        ✓
                    </span>
                    Created project
                </div>
                <div className="activity-item">
                    <span>
                        ⚡
                    </span>
                    Updated dashboard task
                </div>
                <div className="activity-item">
                    <span>
                        🐞
                    </span>
                    Fixed login issue
                </div>
            </div>
            {
                showModal && (
                    <CreateTaskModal
                        projectId={project.id}
                        closeModal={() =>
                            setShowModal(false)
                        }
                        refresh={loadProject}
                    />
                )
            }
        </div>
    );
}

export default ProjectDetail;