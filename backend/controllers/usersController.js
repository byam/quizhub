import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function signin(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email }).lean();
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const JWT_TOKEN = jwt.sign(
                    {
                        ...user,
                        password: "",
                    },
                    process.env.SECRET_KEY
                );
                res.json({ success: true, data: JWT_TOKEN });
            } else {
                const error = new Error("Wrong password");
                error.status = 404;
                next(error);
            }
        } else {
            const error = new Error("User Not Found!");
            error.status = 404;
            next(error);
        }
    } catch (error) {
        next(error);
    }
}

export async function signup(req, res, next) {
    try {
        const new_user = req.body;
        const { password: plain_password } = new_user;

        // bcrypt password
        const saltRounds = 10;
        const hashed_password = await bcrypt.hash(plain_password, saltRounds);

        const result = await UserModel.create({
            ...new_user,
            password: hashed_password,
        });
        // console.log(result)
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}
