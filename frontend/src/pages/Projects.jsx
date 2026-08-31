import { useEffect, useState } from "react";
import api from "../api/client";
import ProjectCard from "../components/ProjectCard";

function Projects() {
    const [projects, setProjects]
        =
        useState([]);

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

    return (
        <div>
            <h1>
                Projects
            </h1>
            <div className="projects-grid">
                {
                    projects.map(project => (
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