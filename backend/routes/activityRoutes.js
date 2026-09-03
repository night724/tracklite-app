const express = require('express');
const router = express.Router();

const db = require('../config/database');
const auth = require('../middleware/auth');

router.get('/project/:projectId', auth, async (req, res) => {
    try {
        const result = await db.query(
            `
                SELECT
                    a.id,
                    a.action,
                    a.created_at,
                    u.name

                FROM activity_logs a

                LEFT JOIN users u
                ON a.user_id = u.id

                WHERE a.project_id=$1

                ORDER BY a.created_at DESC
                `,
            [req.params.projectId],
        );

        res.json(result.rows);
    } catch (error) {
        console.log('ACTIVITY ERROR:', error.message);

        res.status(500).json({
            message: error.message,
        });
    }
});

module.exports = router;
