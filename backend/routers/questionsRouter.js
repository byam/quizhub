import {
    getQuestions,
    getQuestionById,
    postQuestion,
    updateQuestionById,
    deleteQuestionById,
    getQuestionsOrderBy,
} from "../controllers/questionsController.js";
import { Router } from "express";

import commentsRouter from "../routers/commentsRouter.js";
import reactionsRouter from "./reactionsRouter.js";

const questionsRouter = Router({ mergeParams: true });

questionsRouter.post("/", postQuestion);
questionsRouter.get("/", getQuestions);
questionsRouter.get("/order_by", getQuestionsOrderBy);
questionsRouter.get("/:question_id", getQuestionById);
questionsRouter.patch("/:question_id", updateQuestionById);
questionsRouter.delete("/:question_id", deleteQuestionById);

questionsRouter.use("/:question_id/comments", commentsRouter);
questionsRouter.use("/:question_id/reactions", reactionsRouter);
export default questionsRouter;
