const db = require("../config/database");

class User {
    static async findByEmail(email) {
        const result = await db.query(
            `
        SELECT
            u.*,
            w.id AS workspace_id
        FROM users u
        LEFT JOIN workspace_members wm
        ON wm.user_id = u.id
        LEFT JOIN workspaces w
        ON w.id = wm.workspace_id
        WHERE u.email=$1
        LIMIT 1
        `,
            [email]
        );
        return result.rows[0];
    }

    static async findById(id) {

        const result = await db.query(
            `
        SELECT
            u.id,
            u.name,
            u.email,
            u.role,
            u.avatar,
            wm.workspace_id
        FROM users u
        LEFT JOIN workspace_members wm
            ON wm.user_id = u.id
        WHERE u.id = $1
        LIMIT 1
        `,
            [id]
        );
        return result.rows[0];
    }
    static async create(user) {
        const {
            id,
            organization_id,
            name,
            email,
            password,
            role

        } = user;
        const result =
            await db.query(
                `
            INSERT INTO users
            (
                id,
                organization_id,
                name,
                email,
                password,
                role
            )

            VALUES
            (
                $1,$2,$3,$4,$5,$6
            )

            RETURNING *
            `,

                [
                    id,
                    organization_id,
                    name,
                    email,
                    password,
                    role
                ]

            );

        return result.rows[0];

    }
}

module.exports = User;