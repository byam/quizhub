import courseModel from "../models/courseModel.js";
import mongoose from "mongoose";

export async function postQuestion(req, res, next) {
    try {
        const { course_id } = req.params;
        const new_question = req.body;
        const question = {
            ...new_question,
            user: {
                _id: req.token._id,
                name: req.token.name,
            },
        };
        console.log("here:", question);
        const result = await courseModel.updateOne(
            {
                _id: course_id,
            },
            {
                $push: {
                    questions: question,
                },
            }
        );
        if (!result) {
            const error = new Error("Question not updated!");
            error.status = 404;
            next(error);
        }
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function getQuestions(req, res, next) {
    try {
        const { course_id } = req.params;
        const result = await courseModel.findOne(
            // query
            {
                _id: course_id,
            },
            // projection
            {
                questions: 1,
            }
        );

        if (!result) {
            res.json({ success: true, data: result });
        } else {
            res.json({ success: true, data: result.questions });
        }
    } catch (error) {
        next(error);
    }
}

export async function getQuestionsOrderBy(req, res, next) {
    try {
        const { course_id } = req.params;

        const order_by = req.query.order_by || "createdAt";
        const text = req.query.text || "";

        const page_number = parseInt(req.query.page_number) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Aggregate pipeline
        let aggregate = [];
        aggregate.push(
            // Match documents with the specified course code
            { $match: { _id: new mongoose.Types.ObjectId(course_id) } },

            // Unwind the questions array
            { $unwind: "$questions" }
        );

        if (text) {
            aggregate.push(
                // Match documents with the specified text
                {
                    $match: {
                        "questions.text": {
                            $regex: text, // by regular expression
                            $options: "i", // case insensitive
                        },
                    },
                }
            );
        }

        if (order_by === "reactions" || order_by === "comments") {
            aggregate.push(
                // Group by the question _id, and count, reactions or comments
                {
                    $group: {
                        _id: "$questions._id",
                        count: {
                            $sum: {
                                $size: {
                                    $ifNull: ["$questions." + order_by, []],
                                },
                            },
                        },
                        // include the first question document
                        question: { $first: "$questions" },
                    },
                }
            );
            aggregate.push(
                // Sort by count, descending
                { $sort: { count: -1 } }
            );

            // projecttion
            aggregate.push(
                // move all question fields to the root, including count
                {
                    $replaceRoot: {
                        newRoot: {
                            $mergeObjects: ["$question", { count: "$count" }],
                        },
                    },
                }
            );
        } else {
            aggregate.push(
                // Sort by  questions, created_at, descending
                { $sort: { ["questions." + order_by]: -1 } }
            );

            // projecttion
            aggregate.push(
                // move all question fields to the root
                {
                    $replaceRoot: {
                        newRoot: "$questions",
                    },
                }
            );
        }

        // skip and limit
        aggregate.push(
            // Skip documents
            { $skip: (page_number - 1) * limit }
        );
        aggregate.push(
            // Limit the number of documents
            { $limit: limit }
        );

        const result = await courseModel.aggregate(aggregate);

        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function getQuestionById(req, res, next) {
    try {
        const { course_id, question_id } = req.params;

        // return document = course.questions[0]
        const result = await courseModel.findOne(
            // query
            {
                _id: course_id,
                "questions._id": question_id,
            },
            // projection
            {
                "questions.$": 1,
            }
        );

        res.json({ success: true, data: result.questions[0] });
    } catch (error) {
        next(error);
    }
}

export async function updateQuestionById(req, res, next) {
    try {
        const { course_id, question_id } = req.params;
        const user_id = req.token._id;
        const { text, choices, correctIndex, explanation } = req.body;

        // TODO: remove only question.user._id == req.token._id
        const result = await courseModel.updateOne(
            // query
            {
                _id: course_id,
                "questions._id": question_id,
            },
            // update
            {
                $set: {
                    "questions.$.text": text,
                    "questions.$.choices": choices,
                    "questions.$.correctIndex": correctIndex,
                    "questions.$.explanation": explanation,
                },
            }
        );

        if (!result) {
            const error = new Error(
                "Question not updated or you are not the owner!"
            );
            error.status = 404;
            next(error);
        }

        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function deleteQuestionById(req, res, next) {
    try {
        const { course_id, question_id } = req.params;
        const user_id = req.token._id;

        const result = await courseModel.updateOne(
            // query
            {
                _id: course_id,
            },
            {
                // next TODO: remove only question.user._id == req.token._id
                $pull: {
                    questions: { _id: question_id },
                },
            },
            { new: true }
        );

        if (!result) {
            const error = new Error(
                "Question not deleted or you are not the owner!"
            );
            error.status = 404;
            next(error);
        }

        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}
