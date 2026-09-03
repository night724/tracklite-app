import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';

function IssueDetail() {
    const { id } = useParams();
    const [issue, setIssue] = useState(null);
    const [comment, setComment] = useState('');
    useEffect(() => {
        loadIssue();
    }, [id]);

    async function loadIssue() {
        try {
            const issueRes = await api.get(`/issues/${id}`);
            const commentRes = await api.get(`/comments/issue/${id}`);
            setIssue({
                ...issueRes.data,
                comments: commentRes.data,
            });
        } catch (error) {
            console.log('LOAD ISSUE ERROR:', error);
        }
    }

    async function addComment() {
        if (!comment.trim()) return;

        try {
            await api.post('/comments', {
                issue_id: id,
                body: comment,
            });
            setComment('');
            await loadIssue();
        } catch (error) {
            console.log(error);
        }
    }

    if (!issue) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="issue-detail-page">
            {/* HEADER */}

            <div className="issue-header-card">
                <div className="issue-main-title">
                    <span className="issue-number">{issue.issue_key}</span>

                    <h1>{issue.title}</h1>

                    <p>{issue.description || 'No description'}</p>
                </div>

                <div className="issue-badge-area">
                    <span
                        className={`priority-badge ${issue.priority?.toLowerCase()}`}
                    >
                        {issue.priority}
                    </span>

                    <span className="status-badge">{issue.status}</span>
                </div>
            </div>

            <div className="issue-layout">
                {/* LEFT */}

                <div className="issue-left">
                    <div className="issue-card">
                        <h2>Description</h2>

                        <p>{issue.description || 'No description available'}</p>
                    </div>

                    <div className="issue-card comments-section">
                        <div className="comments-header">
                            <h2>Comments</h2>

                            <span>{issue.comments?.length || 0}</span>
                        </div>

                        <div className="comments-list">
                            {issue.comments?.length === 0 ? (
                                <div className="empty-comments">
                                    💬
                                    <p>No comments yet</p>
                                    <small>
                                        Start a conversation about this issue
                                    </small>
                                </div>
                            ) : (
                                issue.comments.map((comment) => (
                                    <div
                                        className="comment-item"
                                        key={comment.id}
                                    >
                                        <div className="comment-avatar">
                                            {comment.name
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div className="comment-body">
                                            <div className="comment-top">
                                                <strong>
                                                    {comment.name || 'User'}
                                                </strong>

                                                <small>Recently</small>
                                            </div>

                                            <p>{comment.body}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="comment-box">
                            <textarea
                                placeholder="Write a comment..."

                                value={comment}

                                onChange={(e) => setComment(e.target.value)}
                            />

                            <button
                                className="comment-send-btn"

                                onClick={addComment}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}

                <div className="issue-right">
                    <div className="issue-card">
                        <h2>Details</h2>

                        <div className="detail-line">
                            <span>Status</span>

                            <strong>{issue.status}</strong>
                        </div>

                        <div className="detail-line">
                            <span>Priority</span>

                            <strong>{issue.priority}</strong>
                        </div>

                        <div className="detail-line">
                            <span>Type</span>

                            <strong>{issue.type || 'Issue'}</strong>
                        </div>
                    </div>

                    <div className="issue-card">
                        <h2>Activity</h2>

                        <div className="activity-item">✓ Issue created</div>

                        <div className="activity-item">⚡ Status updated</div>

                        <div className="activity-item">💬 Comment added</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IssueDetail;
