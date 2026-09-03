const express = require("express");
const router = express.Router();

const db = require("../config/database");
const auth = require("../middleware/auth");



router.get(
    "/",
    auth,
    async (req, res) => {

        try {

            const result =
                await db.query(
                    `
                    SELECT

                        n.id,
                        n.message,
                        n.type,
                        n.reference_id,
                        n.read,
                        n.created_at,


                        inviter.name AS sender_name,
                        inviter.email AS sender_email,


                        w.name AS workspace_name


                    FROM notifications n


                    LEFT JOIN workspace_invitations wi
                    ON n.reference_id = wi.id
                    AND n.type='WORKSPACE_INVITE'


                    LEFT JOIN users inviter
                    ON wi.inviter_id = inviter.id


                    LEFT JOIN workspaces w
                    ON wi.workspace_id = w.id


                    WHERE n.user_id=$1


                    ORDER BY n.created_at DESC
                    `,
                    [
                        req.user.id
                    ]
                );


            res.json(result.rows);

        }
        catch (error) {

            console.log(
                "LOAD NOTIFICATIONS ERROR:",
                error
            );

            res.status(500)
                .json({
                    message:
                        "Cannot load notifications"
                });

        }

    });



router.patch(
    "/:id/read",
    auth,
    async (req, res) => {


        try {

            await db.query(
                `
        UPDATE notifications
        SET read=true
        WHERE id=$1
        AND user_id=$2
        `,
                [
                    req.params.id,
                    req.user.id
                ]);


            res.json({
                message: "Notification read"
            });


        }
        catch (error) {

            res.status(500)
                .json({
                    message: "Update failed"
                });

        }


    });


module.exports = router;