const express = require("express");
const router = express.Router();

const db = require("../config/database");
const auth = require("../middleware/auth");


// GET TEAM MEMBERS
router.get(
    "/workspace/:workspaceId",
    auth,
    async (req, res) => {

        try {

            const result = await db.query(
                `
                SELECT
                    u.id AS user_id,
                    u.name,
                    u.email,
                    wm.role
                FROM workspace_members wm

                JOIN users u
                ON wm.user_id = u.id

                WHERE wm.workspace_id=$1

                ORDER BY u.name
                `,
                [
                    req.params.workspaceId
                ]
            );


            res.json(result.rows);

        }

        catch (error) {

            console.log(error);

            res.status(500).json({
                message: "Cannot load team"
            });

        }

    }
);




// INVITE MEMBER
router.post(
    "/invite",
    auth,
    async (req, res) => {


        try {


            const {
                workspace_id,
                email,
                role
            } = req.body;



            if (!workspace_id || !email) {

                return res.status(400).json({

                    message:
                        "Workspace and email required"

                });

            }



            // find user

            const user =
                await db.query(
                    `
                SELECT id
                FROM users
                WHERE email=$1
                `,
                    [
                        email
                    ]
                );



            if (user.rows.length === 0) {

                return res.status(404).json({

                    message:
                        "User does not exist"

                });

            }



            const userId =
                user.rows[0].id;



            // check already member

            const existing =
                await db.query(
                    `
                SELECT id
                FROM workspace_members
                WHERE workspace_id=$1
                AND user_id=$2
                `,
                    [
                        workspace_id,
                        userId
                    ]
                );



            if (existing.rows.length) {

                return res.status(400).json({

                    message:
                        "User already in workspace"

                });

            }



            const invitation =
                await db.query(
                    `
                    INSERT INTO workspace_invitations
                    (
                    workspace_id,
                    inviter_id,
                    invited_user_id,
                    role
                    )

                    VALUES
                    (
                    $1,
                    $2,
                    $3,
                    $4
                    )

                    RETURNING id
                    `,
                    [
                        workspace_id,
                        req.user.id,
                        userId,
                        role || "MEMBER"
                    ]
                );


            const invitationId =
                invitation.rows[0].id;
            // CREATE INBOX NOTIFICATION

            await db.query(
                `
                INSERT INTO notifications
                (
                user_id,
                message,
                type,
                reference_id
                )

                VALUES
                (
                $1,
                $2,
                $3,
                $4
                )
                `,
                [
                    userId,
                    "You have been invited to join a workspace",
                    "WORKSPACE_INVITE",
                    invitationId
                ]
            );


            res.json({

                message:
                    "Member invited successfully"

            });



        }

        catch (error) {

            console.log(
                "INVITE ERROR:",
                error
            );


            res.status(500).json({

                message:
                    "Invite failed"

            });

        }


    }
);
// ACCEPT WORKSPACE INVITE
router.post(
    "/invite/:notificationId/accept",
    auth,
    async (req, res) => {
        try {
            const notificationId =
                req.params.notificationId;

            const invite =
                await db.query(
                    `
                    SELECT
                    wi.id,
                    wi.workspace_id,
                    wi.role

                    FROM workspace_invitations wi

                    WHERE wi.id = (
                        SELECT reference_id
                        FROM notifications
                        WHERE id=$1
                    )

                    AND wi.invited_user_id=$2
                    AND wi.status='PENDING'

                    LIMIT 1
                    `,
                    [
                        notificationId,
                        req.user.id
                    ]
                );

            if (invite.rows.length === 0) {
                return res.status(404).json({
                    message:
                        "Invitation not found"
                });
            }

            const invitation =
                invite.rows[0];

            await db.query(
                `
                INSERT INTO workspace_members
                (
                    id,
                    workspace_id,
                    user_id,
                    role
                )
                VALUES
                (
                    gen_random_uuid(),
                    $1,
                    $2,
                    $3
                )
                `,
                [
                    invitation.workspace_id,
                    req.user.id,
                    invitation.role
                ]
            );

            await db.query(
                `
                UPDATE workspace_invitations
                SET status='ACCEPTED'
                WHERE id=$1
                `,
                [
                    invitation.id
                ]
            );

            await db.query(
                `
                UPDATE notifications
                SET read=true
                WHERE id=$1
                `,
                [
                    notificationId
                ]
            );
            res.json({
                message:
                    "Joined workspace successfully"
            });
        }
        catch (error) {
            console.log(
                "ACCEPT INVITE ERROR:",
                error
            );
            res.status(500).json({
                message:
                    "Accept invite failed"
            });
        }
    }
);


module.exports = router;