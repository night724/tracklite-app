import { useEffect, useState } from "react";
import api from "../api/client";
import InviteMemberModal from "../components/InviteMemberModal";

function MyTeam() {

    const [team, setTeam] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const workspaceId =
        "22222222-2222-2222-2222-222222222222";
    useEffect(() => {
        loadTeam();
    }, []);

    async function loadTeam() {


        try {


            const res =
                await api.get(
                    `/team/workspace/${workspaceId}`
                );


            setTeam(res.data);


        }
        catch (error) {

            console.log(error);

        }


    }




    // group projects by user

    const members = {};


    team.forEach(item => {


        if (!members[item.user_id]) {

            members[item.user_id] = {

                name: item.name,
                email: item.email,
                role: item.role,
                projects: []

            };

        }



        if (item.project_id) {

            members[item.user_id]
                .projects.push({

                    id: item.project_id,
                    name: item.project_name,
                    status: item.project_status

                });

        }


    });



    return (

        <div className="team-page">


            <div className="team-header">

                <div>
                    <h1>
                        My Team
                    </h1>

                    <p>
                        Manage your workspace members
                        and their projects
                    </p>
                </div>


                <button
                    className="primary-btn"
                    onClick={() => setShowModal(true)}
                >
                    + Invite Member
                </button>


            </div>



            <div className="team-search">

                <input
                    placeholder="Search members..."
                />

            </div>





            <div className="team-grid">


                {
                    Object.values(members)
                        .map(member => (


                            <div
                                className="team-card"
                                key={member.email}
                            >


                                <div className="team-profile">


                                    <div className="avatar">

                                        {
                                            member.name
                                                .charAt(0)
                                                .toUpperCase()
                                        }

                                    </div>


                                    <div>

                                        <h2>
                                            {member.name}
                                        </h2>


                                        <p>
                                            {member.email}
                                        </p>


                                    </div>


                                    <span className="role-badge">

                                        {member.role}

                                    </span>


                                </div>





                                <div className="team-projects">


                                    <h3>
                                        Projects
                                    </h3>



                                    {

                                        member.projects.length === 0 ?


                                            <p className="empty">
                                                No assigned projects
                                            </p>


                                            :

                                            member.projects.map(project => (


                                                <div
                                                    className="project-box"
                                                    key={project.id}
                                                >


                                                    <div>

                                                        <strong>
                                                            📁 {project.name}
                                                        </strong>


                                                        <p>
                                                            {project.status}
                                                        </p>


                                                    </div>


                                                </div>


                                            ))


                                    }

                                </div>

                            </div>

                        ))

                }
            </div>
            {
                showModal &&

                <InviteMemberModal

                    workspaceId={workspaceId}

                    closeModal={() =>
                        setShowModal(false)
                    }

                    refresh={loadTeam}

                />
            }

        </div>

    );
}

export default MyTeam;