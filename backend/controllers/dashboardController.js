const db = require("../config/database");


exports.getDashboard = async (req, res) => {

    try {

        const userId = req.user.id;


        // Get user's workspace
        const workspace =
            await db.query(
                `
                SELECT workspace_id
                FROM workspace_members
                WHERE user_id=$1
                LIMIT 1
                `,
                [
                    userId
                ]
            );


        const workspaceId =
            workspace.rows[0]?.workspace_id;



        if (!workspaceId) {

            return res.status(404)
                .json({
                    message:
                        "Workspace not found"
                });

        }



        // Total Projects

        const projects =
            await db.query(
                `
                SELECT COUNT(*)
                FROM projects
                WHERE workspace_id=$1
                `,
                [
                    workspaceId
                ]
            );




        // Total Tasks

        const tasks =
            await db.query(
                `
                SELECT COUNT(*)
                FROM tasks t
                JOIN projects p
                ON t.project_id=p.id
                WHERE p.workspace_id=$1
                `,
                [
                    workspaceId
                ]
            );




        // Total Issues

        const issues =
            await db.query(
                `
                SELECT COUNT(*)
                FROM issues i
                JOIN tasks t
                ON i.task_id=t.id
                JOIN projects p
                ON t.project_id=p.id
                WHERE p.workspace_id=$1
                `,
                [
                    workspaceId
                ]
            );




        // Completed Tasks

        const completed =
            await db.query(
                `
                SELECT COUNT(*)
                FROM tasks t
                JOIN projects p
                ON t.project_id=p.id
                WHERE p.workspace_id=$1
                AND t.status='DONE'
                `,
                [
                    workspaceId
                ]
            );





        // Recent Projects

        const recentProjects =
            await db.query(
                `
                SELECT
                    id,
                    name,
                    status,
                    created_at
                FROM projects
                WHERE workspace_id=$1
                ORDER BY created_at DESC
                LIMIT 5
                `,
                [
                    workspaceId
                ]
            );





        // Recent Tasks

        const recentTasks =
            await db.query(
                `
                SELECT
                    t.id,
                    t.title,
                    t.status,
                    t.priority
                FROM tasks t
                JOIN projects p
                ON t.project_id=p.id
                WHERE p.workspace_id=$1
                ORDER BY t.created_at DESC
                LIMIT 5
                `,
                [
                    workspaceId
                ]
            );





        res.json({

            workspaceId,


            stats: {

                projects:
                    Number(
                        projects.rows[0].count
                    ),


                tasks:
                    Number(
                        tasks.rows[0].count
                    ),


                issues:
                    Number(
                        issues.rows[0].count
                    ),


                completed:
                    Number(
                        completed.rows[0].count
                    )

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