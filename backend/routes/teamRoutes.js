const express = require("express");
const router = express.Router();

const db = require("../config/database");
const auth = require("../middleware/auth");



router.get(
    "/workspace/:workspaceId",
    auth,
    async (req, res) => {

        try {


            const result =
                await db.query(
                    `
SELECT

u.id AS user_id,
u.name,
u.email,

wm.role,


p.id AS project_id,
p.name AS project_name,
p.status AS project_status


FROM workspace_members wm


JOIN users u
ON wm.user_id = u.id


LEFT JOIN project_members pm
ON u.id = pm.user_id


LEFT JOIN projects p
ON pm.project_id = p.id


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

            console.log(
                "TEAM ERROR:",
                error
            );


            res.status(500)
                .json({
                    message: "Cannot load team"
                });

        }


    }
);



module.exports = router;