const db = require('../config/database');
class Issue {
    static async getByTask(taskId) {
        const result = await db.query(
            `
                SELECT
                i.*,
                u.name AS assigned_name
                FROM issues i
                LEFT JOIN users u
                ON i.assigned_to=u.id
                WHERE i.task_id=$1
                ORDER BY i.created_at DESC
                `,
            [taskId],
        );
        return result.rows;
    }

    static async getById(id) {
        const issue = await db.query(
            `
                SELECT
                i.*,
                u.name AS assigned_name
                FROM issues i
                LEFT JOIN users u
                ON i.assigned_to=u.id
                WHERE i.id=$1
                `,

            [id],
        );
        return issue.rows[0];
    }

    static async create(data) {
        const { task_id, issue_key, title, description, priority, assigned_to, created_by } = data;

        const result = await db.query(
            `
                INSERT INTO issues
(
task_id,
issue_key,
title,
description,
priority,
assigned_to,
created_by
)

VALUES
($1,$2,$3,$4,$5,$6,$7)
                RETURNING *
                `,
            [task_id, issue_key, title, description, priority, assigned_to, created_by],
        );
        return result.rows[0];
    }
    static async update(id, data) {
        const { title, description, status, priority, assigned_to } = data;

        const result = await db.query(
            `
        UPDATE issues
        SET
            title=$1,
            description=$2,
            status=$3,
            priority=$4,
            assigned_to=$5,
            updated_at=CURRENT_TIMESTAMP

        WHERE id=$6

        RETURNING *
        `,
            [title, description, status, priority, assigned_to, id],
        );

        return result.rows[0];
    }
    static async addActivity(issueId, userId, action) {
        await db.query(
            `
            INSERT INTO activity_logs
            (
            issue_id,
            user_id,
            action
            )
            VALUES
            ($1,$2,$3)
            `,
            [issueId, userId, action],
        );
    }
    static async delete(id) {
        await db.query(
            `
        DELETE FROM activity_logs
        WHERE issue_id=$1
        `,
            [id],
        );

        await db.query(
            `
        DELETE FROM issues
        WHERE id=$1
        `,
            [id],
        );
    }
}

module.exports = Issue;
