const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const db = require("../config/database");


// =======================
// REGISTER
// =======================

exports.register = async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;



        // Check existing user

        const existing =
            await User.findByEmail(email);


        if (existing) {

            return res.status(400).json({

                message:
                    "Email already exists"

            });

        }



        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );




        /*
            1. CREATE ORGANIZATION
        */


        const organizationId = uuidv4();


        await db.query(

            `
            INSERT INTO organizations
            (
                id,
                name
            )

            VALUES
            (
                $1,
                $2
            )
            `,

            [

                organizationId,

                `${name}'s Organization`

            ]

        );







        /*
            2. CREATE USER
        */


        const userId = uuidv4();



        await User.create({

            id: userId,

            organization_id: organizationId,

            name,

            email,

            password: hashedPassword,

            role: "OWNER"

        });








        /*
            3. CREATE WORKSPACE
        */


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

                organizationId,

                `${name}'s Workspace`,

                userId

            ]

        );









        /*
            4. ADD USER TO WORKSPACE
        */


        await db.query(

            `
            INSERT INTO workspace_members
            (
                id,
                workspace_id,
                user_id,
                role
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

                uuidv4(),

                workspaceId,

                userId,

                "OWNER"

            ]

        );








        res.status(201).json({

            message:
                "User created",

            user: {

                id: userId,

                name,

                email,

                role: "OWNER",

                workspaceId

            }

        });



    }

    catch (error) {


        console.log(
            "REGISTER ERROR:",
            error.message
        );


        res.status(500).json({

            message: error.message

        });


    }

};





// =======================
// LOGIN
// =======================


exports.login = async (req, res) => {


    try {


        const {
            email,
            password
        } = req.body;




        const user =
            await User.findByEmail(email);



        if (!user) {

            return res.status(404).json({

                message: "User not found"

            });

        }





        const valid =
            await bcrypt.compare(
                password,
                user.password
            );



        if (!valid) {

            return res.status(401).json({

                message: "Wrong password"

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


        console.log(
            "LOGIN ERROR:",
            error.message
        );


        res.status(500).json({

            message: "Login failed"

        });


    }


};



exports.me = async (req, res) => {


    try {


        const user =
            await User.findById(
                req.user.id
            );

        if (!user) {
            return res.status(404).json({
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
        res.status(500).json({
            message: "Cannot get user"
        });
    }
};