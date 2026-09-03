import { useEffect, useState } from "react";
import api from "../api/client";

function Inbox() {
    const [notifications, setNotifications] = useState([]);
    useEffect(() => {
        loadInbox();
    }, []);

    async function loadInbox() {
        try {
            const res =
                await api.get("/notifications");
            setNotifications(res.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    async function markRead(id) {
        try {
            await api.patch(
                `/notifications/${id}/read`
            );
            loadInbox();
        }
        catch (error) {
            console.log(error);
        }
    }

    async function acceptInvite(notificationId) {
        try {
            await api.post(
                `/team/invite/${notificationId}/accept`
            );
            alert(
                "Workspace joined successfully"
            );
            loadInbox();
        }
        catch (error) {
            console.log(
                "ACCEPT INVITE ERROR:",
                error
            );
        }
    }

    return (
        <div className="inbox-page">
            <div className="page-header">
                <div>
                    <h1>
                        Inbox
                    </h1>
                    <p>
                        Your notifications and update
                    </p>
                </div>
            </div>

            <div className="notification-list">
                {
                    notifications.length === 0 && (
                        <div className="empty-box">
                            <div className="empty-icon">
                                🔔
                            </div>
                            <h3>
                                No notifications
                            </h3>
                            <p>
                                You are all caught up.
                            </p>
                        </div>
                    )
                }

                {
                    notifications.map(item => (
                        <div
                            key={item.id}
                            className={
                                item.read
                                    ? "notification-card"
                                    : "notification-card unread"
                            }
                        >
                            <div className="notification-avatar">
                                {
                                    item.sender_name
                                        ? item.sender_name
                                            .charAt(0)
                                            .toUpperCase()
                                        : "U"
                                }
                            </div>

                            <div className="notification-content">
                                {
                                    item.type === "WORKSPACE_INVITE" ? (
                                        <>
                                            <h2>
                                                {item.sender_name}
                                            </h2>
                                            <p className="sender-email">
                                                {item.sender_email}
                                            </p>
                                            <p>
                                                Invited you to join
                                            </p>
                                            <strong>
                                                {item.workspace_name || "workspace"}
                                            </strong>
                                        </>
                                    )
                                        :
                                        (
                                            <>
                                                <h2>
                                                    Notification
                                                </h2>
                                                <p>
                                                    {item.message}
                                                </p>
                                            </>
                                        )
                                }

                                <small>
                                    {
                                        new Date(item.created_at)
                                            .toLocaleString()
                                    }
                                </small>
                            </div>

                            <div className="notification-actions">
                                {
                                    item.type === "WORKSPACE_INVITE" && (
                                        <button
                                            className="primary-btn"
                                            onClick={() =>
                                                acceptInvite(item.id)
                                            }
                                        >
                                            Accept Invite
                                        </button>
                                    )
                                }

                                {
                                    !item.read && (
                                        <button
                                            className="secondary-btn"
                                            onClick={() =>
                                                markRead(item.id)
                                            }
                                        >
                                            Mark Read
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default Inbox;