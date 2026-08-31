import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import CreateIssueModal from "../components/CreateIssueModal";

function Issues() {
    const { projectId } = useParams();
    const [issues, setIssues] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");
    const [priority, setPriority] = useState("ALL");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadIssues();
    }, []);
    async function loadIssues() {
        try {
            const res =
                await api.get(
                    `/issues/project/${projectId}`
                );
            setIssues(res.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    const filteredIssues =
        issues.filter(issue => {
            const searchMatch =
                issue.title
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );
            const statusMatch =
                status === "ALL" ||
                issue.status === status;
            const priorityMatch =
                priority === "ALL" ||
                issue.priority === priority;
            return searchMatch &&
                statusMatch &&
                priorityMatch;
        });

    return (
        <div className="issue-page">

            <div className="issue-header">
                <div>
                    <h1>
                        Issues
                    </h1>
                    <p>
                        Manage project bugs and problems
                    </p>
                </div>

                <button
                    className="primary-btn"
                    onClick={() => setShowModal(true)}
                >
                    + New Issue
                </button>

            </div>

            <div className="issue-controls">
                <input
                    placeholder="Search issues..."
                    value={search}
                    onChange={
                        e => setSearch(e.target.value)
                    }
                />

                <select
                    value={status}
                    onChange={
                        e => setStatus(e.target.value)
                    }
                >
                    <option value="ALL">
                        All Status
                    </option>
                    <option value="TODO">
                        Todo
                    </option>
                    <option value="IN_PROGRESS">
                        In Progress
                    </option>
                    <option value="DONE">
                        Done
                    </option>
                </select>

                <select
                    value={priority}
                    onChange={
                        e => setPriority(e.target.value)
                    }
                >
                    <option value="ALL">
                        All Priority
                    </option>
                    <option value="HIGH">
                        High
                    </option>
                    <option value="MEDIUM">
                        Medium
                    </option>
                    <option value="LOW">
                        Low
                    </option>
                </select>
            </div>

            <div className="issues-container">
                {
                    filteredIssues.map(issue => (
                        <Link
                            key={issue.id}
                            to={`/issues/${issue.id}`}
                            className="issue-item"
                        >
                            <div className="issue-key">
                                {issue.issue_key}
                            </div>

                            <div className="issue-content">
                                <h3>
                                    {issue.title}
                                </h3>
                                <p>
                                    {
                                        issue.description ||
                                        "No description"
                                    }
                                </p>

                                <div className="issue-tags">
                                    <span className="type-tag">
                                        🐞 {issue.type || "Issue"}
                                    </span>

                                    <span className="priority-tag">
                                        {issue.priority}
                                    </span>

                                    <span className="status-tag">
                                        {issue.status}
                                    </span>
                                </div>

                            </div>

                            <div className="issue-time">
                                Updated
                                <br />
                                Recently
                            </div>

                        </Link>
                    ))
                }
            </div>
            {
                showModal && (
                    <CreateIssueModal
                        projectId={projectId}
                        closeModal={() =>
                            setShowModal(false)
                        }
                        refresh={loadIssues}
                    />
                )
            }
        </div>
    );

}

export default Issues;