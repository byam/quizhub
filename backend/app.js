import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";

import coursesRouter from "./routers/coursesRouter.js";
import usersRouter from "./routers/usersRouter.js";

import dotenv from "dotenv";
import { validateJwtToken } from "./middlewares/auth.js";

dotenv.config();

// app
const app = express();
(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB connecion error! ", error);
    }
})();

// middleware

// cors settings
const corsOptions = {
    // allow all origins
    origin: "*",
    // all methods include patch
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    // allow all headers
    allowedHeaders: "*",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

// router

app.use("/api/users", usersRouter);
app.use("/api/courses", validateJwtToken, coursesRouter);

app.use("*", (req, res, next) => {
    const error = new Error("API not found!");
    error.status = 404;
    next(error);
});

// error handler
app.use((error, req, res, next) => {
    const status = error.status || 500;
    res.status(status).json({ success: false, data: error.message });
});

//server port
app.listen(3000, () => {
    console.log("App listening on 3000!");
});
