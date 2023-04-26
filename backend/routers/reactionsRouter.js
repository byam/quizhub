import { Router } from "express";
import {
    getReactionsCount,
    postReaction,
    getReactions,
    getReactionById,
    updateReactionById,
    deleteReactionById,
    deleteReactionByUserId,
    updateReactionByUserId,
} from "../controllers/reactionsControllers.js";

const reactionsRouter = Router({ mergeParams: true });

reactionsRouter.post("/", postReaction);
reactionsRouter.get("/", getReactions);
reactionsRouter.get("/count", getReactionsCount);
reactionsRouter.delete("/delete/by_user", deleteReactionByUserId);
reactionsRouter.patch("/update/by_user", updateReactionByUserId);
reactionsRouter.get("/:reaction_id", getReactionById);
reactionsRouter.patch("/:reaction_id", updateReactionById);
reactionsRouter.delete("/:reaction_id", deleteReactionById);

export default reactionsRouter;
