const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const auth = require('../middleware/auth');

// Workspace Members
router.get('/workspace/:workspaceId', auth, async (req, res) => {
    try {
        const result = await db.query(
            `
                SELECT
                    wm.id,
                    wm.role,
                    u.id AS user_id,
                    u.name,
                    u.email
                FROM workspace_members wm
                JOIN users u
                ON wm.user_id = u.id
                WHERE wm.workspace_id=$1
                ORDER BY u.name
                `,
            [req.params.workspaceId],
        );

        res.json(result.rows);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: 'Cannot load members',
        });
    }
});

// Project Members
router.get('/project/:projectId', auth, async (req, res) => {
    try {
        const result = await db.query(
            `
                    SELECT
                        pm.id,
                        pm.role,
                        u.id AS user_id,
                        u.name,
                        u.email

                    FROM project_members pm

                    JOIN users u
                    ON pm.user_id=u.id

                    WHERE pm.project_id=$1

                    ORDER BY u.name
                    `,
            [req.params.projectId],
        );

        res.json(result.rows);
    } catch (error) {
        console.log('LOAD PROJECT MEMBERS ERROR:', error.message);

        res.status(500).json({
            message: error.message,
        });
    }
});
// Add member to project
router.post('/project/:projectId', auth, async (req, res) => {
    try {
        const { user_id, role } = req.body;

        if (!user_id) {
            return res.status(400).json({
                message: 'User required',
            });
        }

        const exists = await db.query(
            `
            SELECT id
            FROM project_members
            WHERE project_id=$1
            AND user_id=$2
            `,
            [req.params.projectId, user_id],
        );

        if (exists.rows.length) {
            return res.status(400).json({
                message: 'User already assigned to project',
            });
        }

        const result = await db.query(
            `
            INSERT INTO project_members
            (
                id,
                project_id,
                user_id,
                role
            )

            VALUES
            ($1,$2,$3,$4)

            RETURNING *
            `,
            [uuidv4(), req.params.projectId, user_id, role || 'MEMBER'],
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.log('ADD PROJECT MEMBER ERROR:', error);

        res.status(500).json({
            message: error.message,
        });
    }
});
router.get('/users', auth, async (req, res) => {
    try {
        const result = await db.query(
            `
                SELECT
                    id,
                    name,
                    email
                FROM users
                ORDER BY name
                `,
        );

        res.json(result.rows);
    } catch (error) {
        console.log('LOAD USERS ERROR:', error);

        res.status(500).json({
            message: 'Cannot load users',
        });
    }
});
// Add member to workspace
router.post('/workspace/:workspaceId', auth, async (req, res) => {
    try {
        const { user_id, role } = req.body;

        const exists = await db.query(
            `
            SELECT id
            FROM workspace_members
            WHERE workspace_id=$1
            AND user_id=$2
            `,
            [req.params.workspaceId, user_id],
        );

        if (exists.rows.length) {
            return res.status(400).json({
                message: 'User already exists in workspace',
            });
        }

        const result = await db.query(
            `
            INSERT INTO workspace_members
            (
                id,
                workspace_id,
                user_id,
                role
            )

            VALUES
            ($1,$2,$3,$4)

            RETURNING *
            `,
            [uuidv4(), req.params.workspaceId, user_id, role || 'MEMBER'],
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.log('ADD WORKSPACE MEMBER ERROR:', error);

        res.status(500).json({
            message: error.message,
        });
    }
});
module.exports = router;
