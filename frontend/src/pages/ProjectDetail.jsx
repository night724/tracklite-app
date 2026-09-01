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

    }, [projectId]);



    async function loadProject() {

        try {

            const res =
                await api.get(
                    `/projects/${projectId}`
                );

            setProject(res.data);

        }
        catch (error) {

            console.log(error);

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


            {/* Header */}

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


                <Link
                    to={`/projects/${project.id}/tasks`}
                    className="menu-btn"
                >
                    ✅ Tasks
                </Link>


                <Link
                    to={`/projects/${project.id}/issues`}
                    className="menu-btn"
                >
                    🐞 Issues
                </Link>


                <Link
                    to={`/projects/${project.id}/members`}
                    className="menu-btn"
                >
                    👥 Members
                </Link>



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


                    <h2>
                        Recent Activity
                    </h2>


                    <div className="activity-card">

                        ✅ Project created

                        <small>
                            Recently
                        </small>

                    </div>



                    <div className="activity-card">

                        ⚡ Task updated

                        <small>
                            Recently
                        </small>

                    </div>



                    <div className="activity-card">

                        🐞 Issue fixed

                        <small>
                            Recently
                        </small>

                    </div>



                </div>





                <div className="project-panel">


                    <h2>
                        Project Details
                    </h2>



                    <div className="info-row">

                        <span>
                            Status
                        </span>

                        <strong>
                            {project.status}
                        </strong>

                    </div>



                    <div className="info-row">

                        <span>
                            Created
                        </span>

                        <strong>
                            {
                                new Date(
                                    project.created_at
                                ).toLocaleDateString()
                            }
                        </strong>

                    </div>



                    <div className="info-row">

                        <span>
                            Project ID
                        </span>

                        <strong>
                            {project.id.slice(0, 8)}
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