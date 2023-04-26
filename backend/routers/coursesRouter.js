import { Router } from "express";
import questionsRouter from "./questionsRouter.js";
import {
    getCourses,
    postCourse,
    getCourseById,
    updateCourseById,
    deleteCourseById,
    getCoursesCount,
    getCoursesMetaData,
} from "../controllers/coursesController.js";

const router = Router();

router.get("/", getCourses);
router.get("/meta", getCoursesMetaData);
router.get("/count", getCoursesCount);
router.post("/", postCourse);
router.get("/:course_id", getCourseById);
router.patch("/:course_id", updateCourseById);
router.delete("/:course_id", deleteCourseById);

router.use("/:course_id/questions", questionsRouter);
export default router;
