import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";

function IssueDetail() {
    const { id } = useParams();
    const [issue, setIssue] = useState(null);
    const [comment, setComment] = useState("");

    useEffect(() => {
        loadIssue();
    }, []);

    async function loadIssue() {
        try {
            const issueRes =
                await api.get(
                    `/issues/${id}`
                );
            const commentRes =
                await api.get(
                    `/comments/issue/${id}`
                );
            setIssue({
                ...issueRes.data,
                comments: commentRes.data
            });
        }
        catch (error) {
            console.log(
                "LOAD ISSUE ERROR:",
                error
            );
        }
    }

    async function addComment() {

        if (!comment.trim())
            return;

        try {
            await api.post(
                "/comments",
                {
                    issue_id: id,
                    body: comment
                }
            );
            setComment("");
            await loadIssue();
        }
        catch (error) {
            console.log(error);
        }
    }

    if (!issue) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="issue-detail">
            
            <div className="issue-detail-header">
                
                <div>
                    
                    <div className="issue-key-large">

                        {issue.issue_key}

                    </div>

                    <h1>
                        {issue.title}
                    </h1>
                    <p>
                        {
                            issue.description ||
                            "No description"

                        }

                    </p>


                </div>




                <div className="issue-badges">


                    <span className="priority-tag">

                        {issue.priority}

                    </span>



                    <span className="status-tag">

                        {issue.status}

                    </span>



                </div>



            </div>









            <div className="issue-detail-grid">



                <div>


                    <div className="detail-box">


                        <h2>
                            Description
                        </h2>


                        <p>

                            {
                                issue.description ||
                                "No description available"

                            }

                        </p>


                    </div>

                    <div className="detail-box">
                        <h2>
                            Comments
                        </h2>

                        {
                            issue.comments?.map(comment => (

                                <div
                                    className="comment"
                                    key={comment.id}
                                >
                                    <strong>
                                        {comment.name || "User"}
                                    </strong>
                                    <p>
                                        {comment.body}
                                    </p>
                                </div>
                            ))
                        }

                        <div className="comment-input">
                            <textarea
                                placeholder="Write a comment..."
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                            />

                            <button
                                className="primary-btn"
                                onClick={addComment}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="detail-box">
                        <h2>
                            Activity
                        </h2>
                        <div className="activity-row">
                            ✓ Issue created
                        </div>
                        <div className="activity-row">
                            ⚡ Status updated
                        </div>
                        <div className="activity-row">
                            💬 Comment added
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IssueDetail;