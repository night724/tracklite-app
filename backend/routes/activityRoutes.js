const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const db = require("../config/database");


router.use(authenticate);


router.get(
    "/project/:projectId",
    async (req, res) => {

        try {

            const result =
                await db.query(
                    `
            SELECT
                a.id,
                a.action,
                a.created_at,
                u.name

            FROM activity_logs a

            LEFT JOIN users u
            ON a.user_id=u.id

            WHERE a.project_id=$1

            ORDER BY a.created_at DESC

            LIMIT 10

            `,
                    [
                        req.params.projectId
                    ]
                );


            res.json(result.rows);

        }
        catch (error) {

            console.log(error);

            res.status(500)
                .json({
                    message: "Activity loading failed"
                });

        }

    }
);


module.exports = router;