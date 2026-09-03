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
        await Issue.addActivity(issue.id, req.user.id, `Created issue ${issue.issue_key}`);
        res.status(201).json(issue);
    } catch (error) {
        console.error('CREATE ISSUE FAILED:');
        console.error(error);
        res.status(500).json({
            message: error.message,
            detail: error.detail || null,
        });
    }
};

exports.updateIssue = async (req, res) => {
    try {
        const issue = await Issue.update(req.params.id, req.body);
        await Issue.addActivity(issue.id, req.user.id, 'Updated issue');
        res.json(issue);
    } catch (error) {
        res.status(500).json({
            message: 'Update failed',
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
