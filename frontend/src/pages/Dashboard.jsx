import {
    useEffect,
    useState
}
    from "react";


import api from "../api/client";


import { useAuth }
    from "../context/AuthContext";



function Dashboard() {


    const { user } = useAuth();


    const [data, setData]
        =
        useState(null);




    useEffect(() => {


        loadDashboard();


    }, []);





    async function loadDashboard() {


        try {


            const res =
                await api.get(
                    "/dashboard"
                );


            setData(res.data);


        }

        catch (error) {

            console.log(error);

        }


    }






    if (!data) {

        return <h2>Loading dashboard...</h2>;

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


                <div className="stat-card">

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


                </div>




                <div className="stat-card">

                    <h2>
                        ✅ {data.stats.tasks}
                    </h2>

                    <p>
                        Tasks
                    </p>

                </div>





                <div className="stat-card">

                    <h2>
                        🐞 {data.stats.issues}
                    </h2>

                    <p>
                        Issues
                    </p>

                </div>





                <div className="stat-card">

                    <h2>
                        📈 {data.stats.completed}
                    </h2>

                    <p>
                        Completed
                    </p>

                </div>



            </div>









            <div className="dashboard-grid">



                <div className="dashboard-panel">


                    <h2>
                        Recent Projects
                    </h2>



                    {
                        data.projects.map(project => (


                            <div
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


                            </div>


                        ))

                    }



                </div>








                <div className="dashboard-panel">


                    <h2>
                        Recent Tasks
                    </h2>



                    {
                        data.tasks.map(task => (


                            <div
                                className="task-row"
                                key={task.id}
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


                            </div>


                        ))

                    }



                </div>



            </div>



        </div>

    );


}


export default Dashboard;