import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import DashboardPieChart from "../components/DashboardPieChart";

function Dashboard() {
    const { user } = useAuth();
    console.log("CURRENT USER:", user);
    const [data, setData] = useState(null);
    const [charts, setCharts] = useState(null);
    const workspaceId = user?.workspaceId;
    const projectProgressChart =
        charts?.projectProgress.map(project => {
            const completed =
                Number(project.completed_tasks);
            const total =
                Number(project.total_tasks);
            return {
                name: project.name,
                value:
                    total === 0
                        ? 0
                        :
                        Math.round(
                            (completed / total) * 100
                        )
            };
        });
    useEffect(() => {
        loadDashboard();
        loadCharts();
    }, []);

    if (!workspaceId) {
        return <h2>No workspace found</h2>;
    }
    async function loadDashboard() {
        try {
            const res = await api.get("/dashboard");
            setData(res.data);
        }
        catch (error) {
            console.log(error);
        }
    }
    if (!data) {
        return <h2>Loading dashboard...</h2>;
    }
    async function loadCharts() {
        try {
            const res =
                await api.get(
                    "/dashboard/charts"
                );
            setCharts(res.data);
        }
        catch (error) {
            console.log(
                "CHART ERROR",
                error
            );
        }
    }


    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1>
                        Welcome {user?.name} 👋
                    </h1>
                    <p>
                        Workspace overview
                    </p>
                </div>
            </div>

            <div className="stats-grid">
                <Link
                    to={`/workspace/${workspaceId}/projects`}
                    className="stat-card"
                >
                    <div className="stat-icon">
                        📁
                    </div>
                    <div>
                        <h2>
                            {data.stats.projects}
                        </h2>
                        <p>
                            Total Projects
                        </p>
                    </div>
                </Link>

                <Link
                    to={`/workspace/${workspaceId}/tasks`}
                    className="stat-card"
                >
                    <h2>
                        ✅ {data.stats.tasks}
                    </h2>
                    <p>
                        Tasks
                    </p>
                </Link>

                <Link
                    to={`/workspace/${workspaceId}/issues`}
                    className="stat-card"
                >
                    <h2>
                        🐞 {data.stats.issues}
                    </h2>
                    <p>
                        Issues
                    </p>
                </Link>

                <Link
                    to={`/workspace/${workspaceId}/tasks?status=DONE`}
                    className="stat-card"
                >
                    <h2>
                        📈 {data.stats.completed}
                    </h2>
                    <p>
                        Completed
                    </p>
                </Link>



            </div>


            {
                charts && (

                    <div className="dashboard-charts">


                        <DashboardPieChart

                            title="Task Status"

                            data={charts.tasks}

                        />



                        <DashboardPieChart

                            title="Issue Priority"

                            data={charts.issues}

                        />


                        <DashboardPieChart

                            title="Projects Progress"

                            data={projectProgressChart}

                        />

                    </div>

                )
            }






            <div className="dashboard-grid">



                <div className="dashboard-panel">


                    <h2>
                        Recent Projects
                    </h2>



                    {
                        data.projects.map(project => (


                            <Link
                                to={`/projects/${project.id}`}
                                className="project-row"
                                key={project.id}
                            >
                                <div>

                                    <h3>
                                        {project.name}
                                    </h3>


                                    <p>
                                        {project.status}
                                    </p>


                                </div>


                            </Link>


                        ))

                    }



                </div>








                <div className="dashboard-panel">


                    <h2>
                        Recent Tasks
                    </h2>

                    {
                        data.tasks.map(task => (
                            <Link
                                className="task-row"
                                key={task.id}
                                to={`/tasks/${task.id}`}
                            >
                                <div>
                                    <h3>
                                        {task.title}
                                    </h3>
                                    <p>
                                        Priority:
                                        {task.priority}
                                    </p>
                                </div>

                                <span>
                                    {task.status}
                                </span>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default Dashboard;