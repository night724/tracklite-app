const db = require("../config/database");
exports.getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        const projects =
            await db.query(
                `
SELECT COUNT(*) 
FROM projects
WHERE created_by=$1
`,

                [userId]

            );





        // Total tasks

        const tasks =
            await db.query(

                `
SELECT COUNT(*)
FROM tasks
WHERE created_by=$1
`,

                [userId]

            );





        // Total issues

        const issues =
            await db.query(

                `
SELECT COUNT(*)
FROM issues
WHERE created_by=$1
`,

                [userId]

            );





        // Completed tasks

        const completed =
            await db.query(

                `
SELECT COUNT(*)
FROM tasks
WHERE created_by=$1
AND status='DONE'
`,

                [userId]

            );






        // Recent projects

        const recentProjects =
            await db.query(

                `
SELECT

id,
name,
status,
created_at

FROM projects

WHERE created_by=$1

ORDER BY created_at DESC

LIMIT 5

`,

                [userId]

            );






        // Recent tasks

        const recentTasks =
            await db.query(

                `
SELECT

id,
title,
status,
priority

FROM tasks

WHERE created_by=$1

ORDER BY created_at DESC

LIMIT 5

`,

                [userId]

            );







        res.json({

            stats: {

                projects:
                    Number(projects.rows[0].count),

                tasks:
                    Number(tasks.rows[0].count),

                issues:
                    Number(issues.rows[0].count),

                completed:
                    Number(completed.rows[0].count)

            },


            projects:
                recentProjects.rows,


            tasks:
                recentTasks.rows


        });



    }

    catch (error) {


        console.log(
            "Dashboard Error:",
            error
        );


        res.status(500)
            .json({

                message:
                    "Dashboard loading failed"

            });


    }



};