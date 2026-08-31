const db = require("../config/database");

class Project {
    static async getAll(workspaceId) {

        const result =
            await db.query(
                `
                SELECT
                    p.*,
                    u.name AS creator_name
                FROM projects p
                LEFT JOIN users u
                ON p.created_by=u.id
                WHERE p.workspace_id=$1
                ORDER BY p.created_at DESC
                `,
                [workspaceId]
            );
        return result.rows;
    }

    static async getById(id) {
        const result =
            await db.query(
                `
                SELECT
                    p.*,
                    u.name AS creator_name
                FROM projects p
                LEFT JOIN users u
                ON p.created_by=u.id
                WHERE p.id=$1
                `,
                [id]
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