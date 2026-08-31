import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import TaskCard from "../components/TaskCard";

function Tasks() {
    const { projectId } = useParams();
    const [tasks, setTasks] = useState([]);

    useEffect(() => { loadTasks(); }, []);

    async function loadTasks() {
        try {
            const res = await api.get(`/tasks/project/${projectId}`);
            setTasks(res.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h1>
                Tasks
            </h1>
            <div className="tasks-grid">

                {
                    tasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                        />
                    ))
                }
            </div>
        </div>
    );
}

export default Tasks;