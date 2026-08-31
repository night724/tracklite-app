import { useParams } from "react-router-dom";
import { useEffect, useState} from "react";
import api from "../api/client";

function TaskDetail() {
    const { id } = useParams();
    const [task, setTask] = useState(null);

    useEffect(() => { loadTask(); }, []);

    async function loadTask() {
        const res = await api.get( `/tasks/${id}` );
        setTask(res.data);
    }

    if (!task) {
         return <h2>Loading...</h2>;
    }

    return (
        <div>
            <h1>
                {task.title}
            </h1>
            <p>
                {task.description}
            </p>
            <h3>
                Issues
            </h3>
            <p>
                Issue list will be added next.
            </p>
        </div>
    );
}

export default TaskDetail;