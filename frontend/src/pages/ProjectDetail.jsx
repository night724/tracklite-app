import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client";
import CreateTaskModal from "../components/CreateTaskModal";


function ProjectDetail() {

    const { projectId } = useParams();

    const [project, setProject] = useState(null);
    const [activity, setActivity] = useState([]);
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


            const activityRes =
                await api.get(
                    `/activity/project/${projectId}`
                );

            setActivity(activityRes.data);


        }
        catch (error) {

            console.log(error);

        }

    }



    if (!project)
        return <div>Loading...</div>;

    const progress =
        project.taskCount > 0
            ? Math.round(
                (Number(project.completedTasks) /
                    Number(project.taskCount)) * 100
            )
            : 0;

    return (

        <div className="project-page">


            {/* HEADER */}

            <div className="project-hero">


                <div className="project-title-area">


                    <div className="project-logo">
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



                <div className="hero-actions">


                    <span className="status-badge">
                        {project.status || "ACTIVE"}
                    </span>

                    <button
                        className="primary-btn"
                        onClick={() => setShowModal(true)}
                    >
                        + Add Task
                    </button>


                </div>


            </div>


            <div className="project-overview">


                <Link
                    to={`/projects/${project.id}/tasks`}
                    className="overview-card"
                >

                    <span>📋</span>

                    <strong>
                        {project.taskCount || 0}
                    </strong>

                    <p>
                        Tasks
                    </p>

                </Link>



                <Link
                    to={`/projects/${project.id}/issues`}
                    className="overview-card"
                >

                    <span>🐞</span>

                    <strong>
                        {project.issueCount || 0}
                    </strong>

                    <p>
                        Issues
                    </p>

                </Link>



                <Link
                    to={`/projects/${project.id}/members`}
                    className="overview-card"
                >

                    <span>👥</span>

                    <strong>
                        {project.memberCount || 0}
                    </strong>

                    <p>
                        Members
                    </p>

                </Link>




                <Link

                    to={`/projects/${project.id}/tasks?status=DONE`}

                    className="overview-card"

                >
                    <span>
                        📈
                    </span>
                    <strong>
                        {progress}%
                    </strong>
                    <p>
                        Progress
                    </p>
                    <div className="mini-progress">

                        <div
                            style={{
                                width: `${progress}%`
                            }}
                        />
                    </div>
                </Link>


            </div>


            {/* MAIN */}


            <div className="project-content">



                <div className="activity-card">


                    <h2>
                        Recent Activity
                    </h2>



                    {
                        activity.length === 0 ?

                            <div className="empty-activity">

                                <span>
                                    💤
                                </span>

                                <h3>
                                    No activity yet
                                </h3>

                                <p>
                                    Project actions will appear here.
                                </p>

                            </div>

                            :

                            activity.map(item => (

                                <div
                                    className="activity-row"
                                    key={item.id}
                                >


                                    <div>
                                        ⚡
                                    </div>


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

                    }



                </div>





                <div className="info-card">


                    <h2>
                        Project Information
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
                                )
                                    .toLocaleDateString()
                            }
                        </strong>

                    </div>

                    <div className="info-row">

                        <span>
                            Project ID
                        </span>

                        <strong>
                            {
                                project.id.substring(0, 8)
                            }
                        </strong>
                    </div>
                </div>
            </div>

            {
                showModal &&
                <CreateTaskModal
                    projectId={project.id}
                    closeModal={() =>
                        setShowModal(false)
                    }
                    refresh={loadProject}
                />
            }

        </div>
    )
}

export default ProjectDetail;