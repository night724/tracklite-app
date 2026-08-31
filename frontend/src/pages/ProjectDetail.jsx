import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client";

function ProjectDetail() {
    const { id } = useParams();
    const [project, setProject] = useState(null);

    useEffect(() => {
        loadProject();
    }, []);

    async function loadProject() {
        const res = await api.get( `/projects/${id}` );
        setProject(res.data);
    }

    if (!project) {
        return <h2>Loading...</h2>;
    }

    return (
        <div>
            <h1>
                {project.name}
            </h1>
            <p>
                {project.description}
            </p>
            <h3>
                Tasks coming next...
            </h3>
        </div>
    );
}

export default ProjectDetail;