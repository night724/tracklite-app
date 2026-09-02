import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client";
import CreateTaskModal from "../components/CreateTaskModal";

function ProjectDetail() {

    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [activity, setActivity] = useState([]);

    useEffect(() => {
        loadProject();
    }, [projectId]);
    async function loadProject() {

        try {

            const projectRes =
                await api.get(
                    `/projects/${projectId}`
                );

            setProject(projectRes.data);


            try {

                const activityRes =
                    await api.get(
                        `/activity/project/${projectId}`
                    );

                setActivity(activityRes.data);

            }
            catch (activityError) {

                console.log(
                    "Activity loading failed",
                    activityError
                );

                setActivity([]);

            }

        }
        catch (error) {

            console.log(
                "Project loading failed",
                error
            );

        }

    }
    if (!project) {

        return (

            <div className="loading-page">

                Loading project...

            </div>

        );

    }



    return (

        <div className="project-detail-page">

            <div className="project-topbar">

                <Link
                    to="/dashboard"
                    className="back-link"
                >
                    ← Dashboard
                </Link>

            </div>

            <div className="project-header-card">


                <div className="project-header-left">

                    <div className="big-project-icon">

                        📁

                    </div>



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


                </div>




                <span className="project-status-large">

                    {project.status || "ACTIVE"}

                </span>


            </div>






            {/* Actions */}

            <div className="project-menu">

                <button
                    className="primary-btn"
                    onClick={() => setShowModal(true)}
                >
                    + Add Task
                </button>
            </div>







            {/* Statistics */}


            <div className="project-stat-grid">


                <Link
                    to={`/projects/${project.id}/tasks`}
                    className="project-stat-card"
                >

                    <span>
                        📋
                    </span>

                    <h2>
                        {project.taskCount || 0}
                    </h2>

                    <p>
                        Total Tasks
                    </p>

                </Link>





                <Link
                    to={`/projects/${project.id}/issues`}
                    className="project-stat-card"
                >

                    <span>
                        🐞
                    </span>

                    <h2>
                        {project.issueCount || 0}
                    </h2>

                    <p>
                        Issues
                    </p>

                </Link>





                <Link
                    to={`/projects/${project.id}/members`}
                    className="project-stat-card"
                >

                    <span>
                        👥
                    </span>

                    <h2>
                        {project.memberCount || 0}
                    </h2>

                    <p>
                        Members
                    </p>

                </Link>



            </div>








            {/* Content */}


            <div className="project-main-grid">

                <div className="project-panel">

                    <div className="content-card">

                        <h2>
                            Recent Activity
                        </h2>
                        {
                            activity.length === 0 ? (
                                <p>
                                    No recent activity
                                </p>

                            ) : (
                                activity.map(item => (
                                    <div
                                        className="activity-item"
                                        key={item.id}
                                    >
                                        <span>
                                            ⚡
                                        </span>

                                        <div>
                                            <strong>
                                                {item.name || "User"}
                                            </strong>

                                            <p>
                                                {item.action}
                                            </p>
                                            <small>
                                                {
                                                    new Date(
                                                        item.created_at
                                                    )
                                                        .toLocaleString()
                                                }
                                            </small>
                                        </div>
                                    </div>
                                ))
                            )
                        }

                    </div>

                </div>

                <div className="project-panel">
                    <h2>
                        Project Details
                    </h2>

                    <div className="detail-row">
                        <span>
                            Status
                        </span>
                        <strong className="status-text">
                            {
                                project.status || "ACTIVE"
                            }
                        </strong>
                    </div>

                    <div className="detail-row">
                        <span>
                            Created
                        </span>

                        <strong>
                            {
                                new Date(
                                    project.created_at
                                )
                                    .toLocaleDateString()
                            }
                        </strong>

                    </div>

                    <div className="detail-row">
                        <span>
                            Project ID
                        </span>
                        <strong>
                            {
                                project.id.slice(0, 8)
                            }
                        </strong>

                    </div>


                </div>



            </div>






            {
                showModal &&

                <CreateTaskModal

                    projectId={project.id}

                    closeModal={
                        () => setShowModal(false)
                    }

                    refresh={loadProject}

                />

            }



        </div>

    );

}


export default ProjectDetail;