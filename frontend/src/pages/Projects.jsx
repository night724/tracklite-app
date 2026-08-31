import { useEffect, useState } from "react";
import api from "../api/client";
import ProjectCard from "../components/ProjectCard";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState("");
    const workspaceId =
        "22222222-2222-2222-2222-222222222222";
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
                <button className="primary-btn">
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
                    filteredProjects.map(project => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                        />
                    ))
                }
            </div>
        </div>
    );
}

export default Projects;