import { Router } from "express";
import { signin, signup } from "../controllers/usersController.js";

const router = Router();

router.post("/signin", signin);
router.post("/signup", signup);

export default router;
