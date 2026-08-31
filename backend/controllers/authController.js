const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");

exports.register = async (req, res) => {

    try {
        const { name, email, password } = req.body;
        const existing = await User.findByEmail(email);

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
        const user =
            await User.create({
                id: uuidv4(),
                organization_id:
                    null,
                name,
                email,
                password:
                    hashedPassword,
                role:
                    "MEMBER"
            });

        res.status(201)
            .json({ message: "User created", user });
    }
    catch (error) {
        console.log("REGISTER ERROR:", error.message);
        res.status(500)
            .json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user =
            await User.findByEmail(
                email
            );

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
                role: user.role
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

exports.me = async (
    req,
    res
) => {


    try {


        const user =
            await User.findById(
                req.user.id
            );



        res.json(user);



    }

    catch (error) {


        res.status(500)
            .json({

                message:
                    "Cannot get user"

            });


    }



};