import courseModel from "../models/courseModel.js";

export async function postCourse(req, res, next) {
    try {
        const new_course = req.body;
        const result = await courseModel.create({
            ...new_course,
            user: {
                _id: req.token._id,
                name: req.token.name,
            },
        });
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function getCoursesCount(req, res, next) {
    try {
        const result = await courseModel.find({}, {}).countDocuments();
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function getCoursesMetaData(req, res, next) {
    try {
        const course_code = req.query?.course_code || "";
        const find_query = {};

        if (course_code) {
            find_query.course_code = course_code;
        }

        const courses_count = await courseModel
            .find(find_query, {})
            .countDocuments();
        const course_codes = await courseModel
            .find({}, { course_code: 1, _id: 0 })
            .distinct("course_code")
            .sort();
        const instructors = await courseModel
            .find({}, { instructor: 1, _id: 0 })
            .distinct("instructor")
            .sort();
        res.json({
            success: true,
            data: {
                courses_count,
                course_codes,
                instructors,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function getCourses(req, res, next) {
    try {
        const page_number = req.query?.page_number || 1;
        const limit = req.query?.limit || 10;
        const course_code = req.query?.course_code || "";

        const find_query = {};

        if (course_code) {
            find_query.course_code = course_code;
        }

        const result = await courseModel
            .find(find_query, {
                // exclude all questions fields except _id
                "questions.user": 0,
                "questions.text": 0,
                "questions.choices": 0,
                "questions.correctIndex": 0,
                "questions.explanation": 0,
                "questions.createdAt": 0,
                "questions.updatedAt": 0,
                "questions.reactions": 0,
                "questions.comments": 0,
            })
            .sort({ term: -1 })
            .skip(limit * (page_number - 1))
            .limit(limit);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function getCourseById(req, res, next) {
    try {
        const { course_id } = req.params;
        const result = await courseModel.findOne({ _id: course_id });
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function updateCourseById(req, res, next) {
    try {
        const { course_id } = req.params;
        const user_id = req.token._id;
        const update_data = req.body;

        // update course only if user is the owner
        const result = await courseModel.findOneAndUpdate(
            {
                _id: course_id,
                "user._id": user_id,
            },
            update_data,
            { new: true }
        );

        if (!result) {
            const error = new Error(
                "Course not found or you are not the owner"
            );
            error.status = 404;
            next(error);
        }

        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function deleteCourseById(req, res, next) {
    try {
        const { course_id } = req.params;
        const user_id = req.token._id;

        // delete course only if user is the owner
        const result = await courseModel.deleteOne({
            _id: course_id,
            "user._id": user_id,
        });

        if (result.deletedCount === 0) {
            const error = new Error(
                "Course not found or you are not the owner"
            );
            error.status = 404;
            next(error);
        }

        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}
