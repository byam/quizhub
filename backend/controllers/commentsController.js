import courseModel from "../models/courseModel.js";
import mongoose from "mongoose";

export async function postComment(req, res, next) {
    try {
        const { course_id, question_id } = req.params;
        const new_comment = req.body;

        const comment = {
            ...new_comment,
            user: {
                _id: req.token._id,
                name: req.token.name,
            },
        };

        const result = await courseModel.updateOne(
            {
                _id: course_id,
                "questions._id": question_id,
            },
            {
                $push: { "questions.$.comments": comment },
            }
        );

        if (!result.modifiedCount) {
            res.json({ success: false, data: result });
        } else {
            res.json({ success: true, data: result });
        }
    } catch (error) {
        next(error);
    }
}

export async function getComments(req, res, next) {
    try {
        const { course_id, question_id } = req.params;
        const result = await courseModel.findOne(
            { _id: course_id, "questions._id": question_id },
            { "questions.$": 1, _id: 0 }
        );

        if (!result) {
            res.json({ success: true, data: result });
        } else {
            res.json({ success: true, data: result.questions[0].comments });
        }
    } catch (error) {
        next(error);
    }
}

export async function getCommentById(req, res, next) {
    try {
        const { course_id, question_id, comment_id } = req.params;
        const result = await courseModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(course_id),
                },
            },
            {
                $unwind: "$questions",
            },
            {
                $match: {
                    "questions._id": new mongoose.Types.ObjectId(question_id),
                },
            },
            {
                $unwind: "$questions.comments",
            },
            {
                $match: {
                    "questions.comments._id": new mongoose.Types.ObjectId(
                        comment_id
                    ),
                },
            },
            {
                $project: {
                    _id: 0,
                    text: "$questions.comments.text",
                    user: "$questions.comments.user",
                    reactions: "$questions.comments.reactions",
                },
            },
        ]);

        if (!result.length) {
            res.json({ success: false, data: null });
        } else {
            res.json({ success: true, data: result[0] });
        }
    } catch (error) {
        next(error);
    }
}

export async function updateCommentById(req, res, next) {
    try {
        const { course_id, question_id, comment_id } = req.params;
        const { text } = req.body;

        const result = await courseModel.updateOne(
            {
                _id: course_id,
            },
            {
                $set: {
                    "questions.$[fun1].comments.$[fun2].text": text,
                },
            },
            {
                arrayFilters: [
                    { "fun1._id": question_id },
                    { "fun2._id": comment_id },
                ],
            }
        );

        if (!result.modifiedCount) {
            res.json({ success: false, data: result });
        } else {
            res.json({ success: true, data: result });
        }
    } catch (error) {
        next(error);
    }
}

export async function deleteCommentById(req, res, next) {
    try {
        const { course_id, question_id, comment_id } = req.params;

        const result = await courseModel.updateOne(
            { _id: course_id, "questions._id": question_id },
            {
                $pull: {
                    "questions.$.comments": {
                        _id: comment_id,
                    },
                },
            }
        );

        if (!result.modifiedCount) {
            res.json({ success: false, data: result });
        } else {
            res.json({ success: true, data: result });
        }
    } catch (error) {
        next(error);
    }
}
