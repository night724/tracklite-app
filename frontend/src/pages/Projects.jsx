import { useEffect, useState } from "react";
import api from "../api/client";
import ProjectCard from "../components/ProjectCard";
import CreateProjectModal from "../components/CreateProjectModal";
import { useParams, Link } from "react-router-dom";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");
    const { workspaceId } = useParams();
    useEffect(() => {
        loadProjects();
    }, []);

    async function loadProjects() {
        try {
            const res =
                await api.get(
                    `/projects/workspace/${workspaceId}`
                );
            setProjects(res.data);
        }
        catch (error) {
            console.log(error);
        }
    }
    const filteredProjects =
        projects.filter(project =>
            project.name
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )
        );
    return (
        <div className="projects-page">
            <div className="page-header">
                <div>
                    <h1>
                        Projects
                    </h1>
                    <p>
                        Manage your workspace projects
                    </p>
                </div>
                <button
                    className="primary-btn"
                    onClick={() => setShowModal(true)}
                >
                    + New Project
                </button>
            </div>
            <div className="project-toolbar">
                <input
                    placeholder="Search projects..."
                    value={search}
                    onChange={
                        e => setSearch(e.target.value)
                    }
                />
            </div>

            <div className="projects-grid">
                {
                    projects.map(project => (
                        <Link
                            key={project.id}
                            to={`/projects/${project.id}`}
                            className="project-card"
                        >
                            <h2>
                                {project.name}
                            </h2>
                            <p>
                                {
                                    project.description ||
                                    "No description"
                                }
                            </p>
                            <span>
                                {project.status}
                            </span>
                        </Link>
                    ))
                }
            </div>
            {
                showModal &&
                <CreateProjectModal
                    workspaceId={workspaceId}
                    closeModal={() => setShowModal(false)}
                    refresh={loadProjects}
                />
            }
        </div>
    );
}

export default Projects;