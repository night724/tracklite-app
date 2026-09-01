const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const db = require("../config/database");


// REGISTER
exports.register = async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        const existing =
            await User.findByEmail(email);


        if (existing) {

            return res.status(400)
                .json({
                    message:
                        "Email already exists"
                });

        }



        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );



        // 1. Create User

        const userId = uuidv4();


        const user =
            await User.create({

                id: userId,

                organization_id: null,

                name,

                email,

                password: hashedPassword,

                role: "MEMBER"

            });



        // 2. Create Workspace

        const workspaceId = uuidv4();



        await db.query(

            `
            INSERT INTO workspaces
            (
                id,
                organization_id,
                name,
                owner_id
            )

            VALUES
            (
                $1,
                $2,
                $3,
                $4
            )

            `,

            [

                workspaceId,

                null,

                `${name}'s Workspace`,

                userId

            ]

        );




        // 3. Add user into workspace_members


        await db.query(

            `
            INSERT INTO workspace_members
            (
                workspace_id,
                user_id
            )

            VALUES
            (
                $1,
                $2
            )

            `,

            [

                workspaceId,

                userId

            ]

        );





        res.status(201)
            .json({

                message:
                    "User created",

                user: {

                    id: userId,

                    name,

                    email,

                    workspaceId

                }

            });


    }


    catch (error) {


        console.log(
            "REGISTER ERROR:",
            error.message
        );


        res.status(500)
            .json({

                message:
                    error.message

            });


    }

};







// LOGIN

exports.login = async (req, res) => {


    try {


        const {
            email,
            password
        } = req.body;




        const user =
            await User.findByEmail(email);



        if (!user) {

            return res.status(404)
                .json({

                    message:
                        "User not found"

                });

        }




        const valid =
            await bcrypt.compare(
                password,
                user.password
            );



        if (!valid) {

            return res.status(401)
                .json({

                    message:
                        "Wrong password"

                });

        }




        // get workspace

        const workspace =
            await db.query(

                `
            SELECT
            workspace_id

            FROM workspace_members

            WHERE user_id=$1

            LIMIT 1

            `,

                [
                    user.id
                ]

            );



        const workspaceId =
            workspace.rows[0]?.workspace_id || null;





        const token =
            jwt.sign(

                {
                    id: user.id,

                    email: user.email
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "7d"
                }

            );






        res.json({

            token,


            user: {


                id: user.id,

                name: user.name,

                email: user.email,

                role: user.role,


                workspaceId

            }


        });



    }


    catch (error) {


        console.log(error);


        res.status(500)
            .json({

                message:
                    "Login failed"

            });


    }


};

// CURRENT USER
exports.me = async (req, res) => {
    try {
        const user =
            await User.findById(req.user.id);
        if (!user) {
            return res.status(404)
                .json({
                    message: "User not found"
                });
        }
        const workspace =
            await db.query(
                `
                SELECT workspace_id
                FROM workspace_members
                WHERE user_id=$1
                LIMIT 1
                `,
                [
                    user.id
                ]
            );
        const workspaceId =
            workspace.rows[0]?.workspace_id || null;
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar || null,
            workspaceId
        });
    }
    catch (error) {
        console.log(error);
        res.status(500)
            .json({
                message: "Cannot get user"
            });
    }
};