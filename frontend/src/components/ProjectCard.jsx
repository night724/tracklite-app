import { Link } from "react-router-dom";


function ProjectCard({ project }) {


    const progress =
        project.progress || 0;


    return (

        <div className="project-card">


            {/* HEADER */}

            <div className="project-card-header">


                <div className="project-icon">

                    {
                        project.name
                            ?.charAt(0)
                            .toUpperCase()
                    }

                </div>



                <div className="project-info">

                    <h2>
                        {project.name}
                    </h2>


                    <span
                        className={
                            `status-badge ${project.status?.toLowerCase()
                            }`
                        }
                    >

                        {
                            project.status ||
                            "ACTIVE"
                        }

                    </span>


                </div>


            </div>





            {/* DESCRIPTION */}


            <p className="project-description">

                {
                    project.description ||
                    "No description available"
                }

            </p>







            {/* STATS */}


            <div className="project-stat-container">


                <div className="project-stat">


                    <strong>
                        {
                            project.taskCount || 0
                        }
                    </strong>


                    <span>
                        Tasks
                    </span>


                </div>





                <div className="project-stat">


                    <strong>
                        {
                            project.memberCount || 0
                        }
                    </strong>


                    <span>
                        Members
                    </span>


                </div>





                <div className="project-stat">


                    <strong>
                        {
                            project.issueCount || 0
                        }
                    </strong>
                    <span>
                        Issues
                    </span>
                </div>
            </div>

            <div className="project-progress">
                <div className="progress-top">
                    <span>
                        Progress
                    </span>
                    <strong>
                        {progress}% Complete
                    </strong>
                </div>

                <div className="progress-track">
                    <div
                        className="progress-value"

                        style={{
                            width: `${progress}%`
                        }}
                    />
                </div>
                <p className="progress-text">
                    {project.completedTasks || 0}
                    /
                    {project.taskCount || 0}
                    tasks completed
                </p>

            </div>

            <Link

                to={`/projects/${project.id}`}

                className="project-action"

            >

                Open Project →

            </Link>




        </div>

    );

}


export default ProjectCard;