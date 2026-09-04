const db = require('../config/database');

class Task {
    static async getByProject(projectId) {
        const result = await db.query(
            `
                SELECT
                t.*,
                u.name AS assigned_name
                FROM tasks t
                LEFT JOIN users u
                ON t.assigned_to=u.id
                WHERE t.project_id=$1
                ORDER BY t.created_at DESC
                `,
            [projectId],
        );
        return result.rows;
    }
    static async getByWorkspace(workspaceId, status) {
        let query = `
                SELECT
                    t.*,
                    u.name AS assigned_name

                FROM tasks t

                JOIN projects p
                ON t.project_id=p.id

                LEFT JOIN users u
                ON t.assigned_to=u.id

                WHERE p.workspace_id=$1
                `;

        const params = [workspaceId];

        if (status) {
            query += `
    AND t.status=$2
    `;
            params.push(status);
        }

        query += `
        ORDER BY t.created_at DESC
`;

        const result = await db.query(query, params);

        return result.rows;
    }
    static async getById(id) {
        const result = await db.query(
            `
                SELECT
                t.*,
                u.name AS assigned_name
                FROM tasks t
                LEFT JOIN users u
                ON t.assigned_to=u.id
                WHERE t.id=$1

                `,
            [id],
        );
        return result.rows[0];
    }
    static async create(data) {
        const { id, project_id, title, description, status, priority, assigned_to, created_by } =
            data;

        const result = await db.query(
            `
        INSERT INTO tasks
        (
            id,
            project_id,
            title,
            description,
            status,
            priority,
            assigned_to,
            created_by
        )

        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8)

        RETURNING *
        `,
            [id, project_id, title, description, status, priority, assigned_to, created_by],
        );

        return result.rows[0];
    }
    static async update(id, data) {
        const { title, description, status, priority, assigned_to, due_date } = data;

        const result = await db.query(
            `
        UPDATE tasks
        SET

        title = COALESCE($1,title),
        description = COALESCE($2,description),
        status = COALESCE($3,status),
        priority = COALESCE($4,priority),
        assigned_to = COALESCE($5,assigned_to),
        due_date = COALESCE($6,due_date),

        updated_at=CURRENT_TIMESTAMP

        WHERE id=$7

        RETURNING *
        `,
            [title, description, status, priority, assigned_to, due_date, id],
        );

        return result.rows[0];
    }
    static async delete(id) {
        await db.query(
            `
            DELETE FROM tasks
            WHERE id=$1
            `,
            [id],
        );
    }
}

module.exports = Task;
