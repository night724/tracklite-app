const Issue = require("../models/Issue");
const { v4: uuidv4 } = require("uuid");
const db = require("../config/database");

exports.getIssues = async (req, res) => {
    try {
        const issues = await Issue.getByTask(
            req.params.taskId
        );
        res.json(issues);
    }
    catch (error) {
        console.log(error);
        res.status(500)
            .json({
                message: "Cannot load issues"
            });
    }
};

exports.getIssue = async (req, res) => {
    try {
        const issue =
            await Issue.getById(
                req.params.id
            );
        res.json(issue);
    }
    catch (error) {
        res.status(500)
            .json({
                message: "Cannot load issue"
            });
    }
};

exports.createIssue = async (req, res) => {
    try {
        const {
            task_id,
            title,
            description,
            priority,
            assigned_to
        } = req.body;

        const count =
            Date.now()
                .toString()
                .slice(-3);
        const issue =
            await Issue.create({
                id: uuidv4(),
                task_id,
                issue_key:
                    `TL-${count}`,
                title,
                description,
                priority:
                    priority || "MEDIUM",
                assigned_to,
                created_by:
                    req.user.id
            });

        await Issue.addActivity(
            issue.id,
            req.user.id,
            `Created issue ${issue.issue_key}`
        );
        res.status(201)
            .json(issue);
    }
    catch (error) {
        console.log(error);
        res.status(500)
            .json({
                message: "Create issue failed"
            });
    }
};

exports.updateIssue = async (req, res) => {
    try {
        const issue = await Issue.update(
            req.params.id,
            req.body
        );
        await Issue.addActivity(
            issue.id,
            req.user.id,
            "Updated issue"
        );
        res.json(issue);
    }
    catch (error) {
        res.status(500)
            .json({
                message: "Update failed"
            });
    }
};
exports.getProjectIssues = async (req,res)=>{

    try {

        const {projectId} = req.params;


        const result = await db.query(

        `
        SELECT
            issues.*,
            tasks.title AS task_title

        FROM issues

        JOIN tasks
        ON issues.task_id = tasks.id

        WHERE tasks.project_id=$1

        ORDER BY issues.created_at DESC
        `,

        [projectId]

        );

        res.json(result.rows);

    }
    catch(error){

        console.log(
            "GET PROJECT ISSUES ERROR:",
            error
        );

        res.status(500)
        .json({
            message:error.message
        });

    }
};