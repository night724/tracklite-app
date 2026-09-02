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
                        Your notifications and updates
                    </p>

                </div>

            </div>



            <div className="notification-list">


                {
                    notifications.length === 0 && (

                        <div className="empty-box">

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

                            <div>

                                <h3>
                                    Notification
                                </h3>

                                <p>
                                    {item.message}
                                </p>

                                <small>
                                    {
                                        new Date(
                                            item.created_at
                                        )
                                            .toLocaleString()
                                    }
                                </small>

                            </div>

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
                                        onClick={() =>
                                            markRead(item.id)
                                        }
                                    >
                                        Mark Read
                                    </button>

                                )
                            }
                        </div>

                    ))
                }

            </div>

        </div>
    );
}
export default Inbox;