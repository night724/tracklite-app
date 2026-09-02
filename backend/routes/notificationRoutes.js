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
        SELECT *
        FROM notifications
        WHERE user_id=$1
        ORDER BY created_at DESC
        `,
                    [
                        req.user.id
                    ]);

            res.json(result.rows);

        }
        catch (error) {

            console.log(error);

            res.status(500)
                .json({
                    message: "Cannot load notifications"
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