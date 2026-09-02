import { useEffect, useState } from "react";
import api from "../api/client";
import InviteMemberModal from "../components/InviteMemberModal";
import { useAuth } from "../context/AuthContext";

function MyTeam() {
    const [search, setSearch] = useState("");
    const [team, setTeam] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();
    const workspaceId = user?.workspaceId;
    useEffect(() => {
        if (workspaceId) {
            loadTeam();
        }
    }, [workspaceId]);

    async function loadTeam() {
        if (!workspaceId) return;
        try {
            const res =
                await api.get(
                    `/team/workspace/${workspaceId}`
                );

            setTeam(res.data);
        }
        catch (error) {

            console.log(
                "LOAD TEAM ERROR:",
                error
            );
        }
    }

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

    const filteredMembers =
        Object.values(members)
            .filter(member => {

                const keyword =
                    search.toLowerCase();


                return (
                    member.name
                        ?.toLowerCase()
                        .includes(keyword)

                    ||

                    member.email
                        ?.toLowerCase()
                        .includes(keyword)

                    ||

                    member.role
                        ?.toLowerCase()
                        .includes(keyword)
                );

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
                    value={search}
                    onChange={
                        e => setSearch(e.target.value)
                    }
                />
            </div>





            <div className="team-grid">
                {
                    filteredMembers.length === 0 && (
                        <div className="empty">
                            <h2>
                                No members found
                            </h2>
                            <p>
                                Try another search
                            </p>
                        </div>
                    )
                }

                {
                    filteredMembers
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