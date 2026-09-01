const db = require("../config/database");

class Project {
    static async getAll(workspaceId) {
        const result =
            await db.query(
                `
                SELECT
                    id,
                    name,
                    description,
                    status,
                    created_at
                FROM projects
                WHERE workspace_id=$1
                ORDER BY created_at DESC
                `,
                [
                    workspaceId
                ]
            );
        return result.rows;
    }
    static async getById(id) {
        const result = await db.query(
            `
        SELECT
            p.*,
            (
                SELECT COUNT(*)
                FROM tasks t
                WHERE t.project_id = p.id
            ) AS "taskCount",
            (
                SELECT COUNT(*)
                FROM project_members pm
                WHERE pm.project_id = p.id
            ) AS "memberCount",
            (
                SELECT COUNT(*)
                FROM issues i
                INNER JOIN tasks t2
                ON i.task_id = t2.id
                WHERE t2.project_id = p.id
            ) AS "issueCount"
        FROM projects p
        WHERE p.id=$1
        `,
            [
                id
            ]
        );
        return result.rows[0];
    }

    static async create(data) {
        const {
            id,
            workspace_id,
            name,
            description,
            created_by
        } = data;
        const result =
            await db.query(
                `
                INSERT INTO projects
                (
                    id,
                    workspace_id,
                    name,
                    description,
                    created_by
                )

                VALUES
                ($1,$2,$3,$4,$5)

                RETURNING *
                `,
                [
                    id,
                    workspace_id,
                    name,
                    description,
                    created_by
                ]
            );
        return result.rows[0];
    }
    static async update(id, data) {
        const {
            name,
            description,
            status
        } = data;

        const result =
            await db.query(

                `
                UPDATE projects
                SET
                name=$1,
                description=$2,
                status=$3,
                updated_at=CURRENT_TIMESTAMP
                WHERE id=$4
                RETURNING *
                `,
                [
                    name,
                    description,
                    status,
                    id
                ]
            );
        return result.rows[0];
    }

    static async delete(id) {
        await db.query(
            `
            DELETE FROM projects
            WHERE id=$1
            `,
            [id]
        );
        return true;
    }
}

module.exports = Project;