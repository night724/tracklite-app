import { Link } from "react-router-dom";

function ProjectCard({ project }) {
    return (

        <div className="project-card">
            <h3>
                {project.name}
            </h3>

            <p>
                {project.description}
            </p>

            <span>
                Status: {project.status}
            </span>

            <br />

            <Link
                to={`/projects/${project.id}`}
            >
                Open Project
            </Link>
        </div>
    );
}

export default ProjectCard;