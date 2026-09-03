const db = require('../config/database');
class Comment {
    static async getByIssue(issueId) {
        const result = await db.query(
            `
                SELECT
                c.*,
                u.name,
                u.email
                FROM comments c
                JOIN users u
                ON c.user_id=u.id
                WHERE c.issue_id=$1
                ORDER BY c.created_at ASC
                `,
            [issueId],
        );
        return result.rows;
    }

    static async create(data) {
        const { id, issue_id, user_id, body } = data;
        const result = await db.query(
            `
                INSERT INTO comments
                (
                id,
                issue_id,
                user_id,
                body
                )
                VALUES
                ($1,$2,$3,$4)
                RETURNING *
                `,
            [id, issue_id, user_id, body],
        );
        return result.rows[0];
    }

    static async delete(id) {
        await db.query(
            `
            DELETE FROM comments
            WHERE id=$1
            `,
            [id],
        );
    }
}

module.exports = Comment;
