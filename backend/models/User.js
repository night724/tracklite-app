const db = require("../config/database");

class User {
    static async findByEmail(email){
        const result =
            await db.query(
            `
            SELECT *
            FROM users
            WHERE email=$1
            `,
            [email]
        );
        return result.rows[0];
    }

    static async findById(id){
        const result =
            await db.query(
            `
            SELECT 
                id,
                name,
                email,
                role,
                avatar
            FROM users
            WHERE id=$1
            `,
            [id]
        );
        return result.rows[0];
    }

    static async create(user){
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