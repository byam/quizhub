import {
    deleteCommentById,
    getCommentById,
    getComments,
    postComment,
    updateCommentById,
} from "../controllers/commentsController.js";
import { Router } from "express";

const commentsRouter = Router({ mergeParams: true });

commentsRouter.post("/", postComment);
commentsRouter.get("/", getComments);
commentsRouter.get("/:comment_id", getCommentById);
commentsRouter.patch("/:comment_id", updateCommentById);
commentsRouter.delete("/:comment_id", deleteCommentById);

export default commentsRouter;
