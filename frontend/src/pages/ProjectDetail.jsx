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


            <div className="project-topbar">

                <Link
                    to="/workspace"
                    className="back-link"
                >
                    ← Projects
                </Link>

            </div>



            <div className="project-hero">


                <div className="project-title">


                    <div className="project-icon">
                        📁
                    </div>


                    <div>

                        <h1>
                            {project.name}
                        </h1>


                        <p>
                            {
                                project.description ||
                                "No description"
                            }
                        </p>

                    </div>


                </div>



                <span className="status-badge">
                    {project.status || "ACTIVE"}
                </span>


            </div>




            <div className="project-actions">

                <button
                    className="primary-btn"
                    onClick={() => setShowModal(true)}
                >
                    + Add Task
                </button>


            </div>





            <div className="project-stats">


                <Link
                    to={`/projects/${project.id}/tasks`}
                    className="stat-box"
                >

                    <h2>
                        {project.taskCount || 0}
                    </h2>

                    <p>
                        Tasks
                    </p>

                </Link>



                <Link
                    to={`/projects/${project.id}/issues`}
                    className="stat-box"
                >

                    <h2>
                        {project.issueCount || 0}
                    </h2>

                    <p>
                        Issues
                    </p>

                </Link>




                <Link
                    to={`/projects/${project.id}/members`}
                    className="stat-box"
                >

                    <h2>
                        {project.memberCount || 0}
                    </h2>

                    <p>
                        Members
                    </p>

                </Link>


            </div>




            <div className="project-content">


                <div className="content-card">


                    <h2>
                        Recent Activity
                    </h2>


                    <div className="activity-item">
                        ✓ Project created
                    </div>


                    <div className="activity-item">
                        ⚡ Task updated
                    </div>


                    <div className="activity-item">
                        🐞 Issue fixed
                    </div>


                </div>





                <div className="content-card">


                    <h2>
                        Project Details
                    </h2>


                    <div className="detail-row">
                        <span>Status</span>
                        <strong>
                            {project.status}
                        </strong>
                    </div>


                    <div className="detail-row">
                        <span>Created</span>
                        <strong>
                            {project.created_at}
                        </strong>
                    </div>


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