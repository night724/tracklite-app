const Issue = require('../models/Issue');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

exports.getIssues = async (req, res) => {
    try {
        const issues = await Issue.getByTask(req.params.taskId);
        res.json(issues);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Cannot load issues',
        });
    }
};

exports.getIssue = async (req, res) => {
    try {
        const issue = await Issue.getById(req.params.id);
        res.json(issue);
    } catch (error) {
        res.status(500).json({
            message: 'Cannot load issue',
        });
    }
};

exports.createIssue = async (req, res) => {
    try {
        console.log('========== CREATE ISSUE ==========');

        console.log('BODY:', req.body);

        console.log('USER:', req.user);

        const { task_id, title, description, priority, assigned_to } = req.body;

        console.log('TASK ID:', task_id);
        console.log('TITLE:', title);
        console.log('PRIORITY:', priority);

        const issue = await Issue.create({
            id: uuidv4(),
            task_id,
            issue_key: `TL-${Date.now().toString().slice(-3)}`,
            title,
            description,
            priority: priority || 'MEDIUM',
            assigned_to: assigned_to || null,
            created_by: req.user.id,
        });

        console.log('ISSUE CREATED:', issue);

        res.status(201).json(issue);
    } catch (error) {
        console.log('========== ERROR ==========');

        console.log('MESSAGE:', error.message);

        console.log('DETAIL:', error.detail);

        console.log('CODE:', error.code);

        res.status(500).json({
            message: error.message,
            detail: error.detail,
        });
    }
};
exports.updateIssue = async (req, res) => {
    try {
        console.log('========== UPDATE ISSUE ==========');
        console.log('ID:', req.params.id);
        console.log('BODY:', req.body);

        const issue = await Issue.update(req.params.id, req.body);

        if (!issue) {
            return res.status(404).json({
                message: 'Issue not found',
            });
        }

        // temporarily disable activity log
        /*
        if (req.user) {

            await Issue.addActivity(
                issue.id,
                req.user.id,
                "Updated issue"
            );

        }
        */

        res.json(issue);
    } catch (error) {
        console.log('UPDATE ERROR:', error);

        res.status(500).json({
            message: error.message,
        });
    }
};
exports.getProjectIssues = async (req, res) => {
    try {
        const { projectId } = req.params;

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

            [projectId],
        );

        res.json(result.rows);
    } catch (error) {
        console.log('GET PROJECT ISSUES ERROR:', error);

        res.status(500).json({
            message: error.message,
        });
    }
};
exports.getWorkspaceIssues = async (req, res) => {
    try {
        const issues = await db.query(
            `
            SELECT
                i.*,
                t.title AS task_title,
                p.name AS project_name
            FROM issues i
            JOIN tasks t
            ON i.task_id = t.id
            JOIN projects p
            ON t.project_id = p.id
            WHERE p.workspace_id=$1
            ORDER BY i.created_at DESC
            `,
            [req.params.workspaceId],
        );
        res.json(issues.rows);
    } catch (error) {
        console.log('WORKSPACE ISSUES ERROR:', error);
        res.status(500).json({
            message: 'Cannot load workspace issues',
        });
    }
};
exports.deleteIssue = async (req, res) => {
    try {
        await Issue.delete(req.params.id);

        res.json({
            message: 'Issue deleted',
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: 'Delete failed',
        });
    }
};
