import { Link } from "react-router-dom";

function ProjectCard({ project }) {
    return (
        <div className="project-card">
            <div className="project-top">
                <div className="project-avatar">
                    {
                        project.name
                            .charAt(0)
                            .toUpperCase()
                    }
                </div>
                <span className="project-status">
                    {project.status || "ACTIVE"}
                </span>
            </div>
            <h2>
                {project.name}
            </h2>

            <p className="project-description">
                {
                    project.description ||
                    "No description added"
                }
            </p>

            <div className="project-info">
                <div>
                    <strong>
                        Tasks
                    </strong>
                    <span>
                        {project.task_count || 0}
                    </span>
                </div>
                <div>
                    <strong>
                        Members
                    </strong>
                    <span>
                        {project.member_count || 0}
                    </span>
                </div>
            </div>

            <Link
                className="project-link"
                to={`/projects/${project.id}`}
            >
                Open Project →
            </Link>
        </div>
    );
}

export default ProjectCard;