import courseModel from "../models/courseModel.js";
import mongoose from "mongoose";

export async function postReaction(req, res, next) {
    try {
        const { course_id, question_id } = req.params;
        const new_reaction = req.body;

        const reaction = {
            ...new_reaction,
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
                $push: { "questions.$.reactions": reaction },
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

export async function getReactionsCount(req, res, next) {
    try {
        const user_id = req.token._id;
        const { course_id, question_id } = req.params;
        const result = await courseModel.findOne(
            { _id: course_id, "questions._id": question_id },
            { "questions.$": 1, _id: 0 }
        );

        if (!result) {
            res.json({ success: true, data: result });
        } else {
            const reactions = result.questions[0].reactions;
            const all_reactions_cnt = reactions.length;
            const thumbs_up_cnt = reactions.filter(
                (reaction) => reaction.type === "up"
            ).length;
            const thumbs_down_cnt = all_reactions_cnt - thumbs_up_cnt;
            const user_reaction = reactions.find(
                (reaction) =>
                    reaction.user._id.toString() === user_id.toString()
            );
            const data = {
                meta: {
                    course_id: course_id,
                    question_id: question_id,
                    user_id: user_id,
                    user_name: req.token.name, // user name
                },
                all: all_reactions_cnt, // count of all reactions
                up: thumbs_up_cnt, // count of thumbs up
                down: thumbs_down_cnt, // count of thumbs down
                user_reaction: user_reaction?.type || null, // user reaction
            };
            res.json({ success: true, data: data });
        }
    } catch (error) {
        next(error);
    }
}

export async function getReactions(req, res, next) {
    try {
        const { course_id, question_id } = req.params;
        const result = await courseModel.findOne(
            { _id: course_id, "questions._id": question_id },
            { "questions.$": 1, _id: 0 }
        );

        if (!result) {
            res.json({ success: true, data: result });
        } else {
            res.json({ success: true, data: result.questions[0].reactions });
        }
    } catch (error) {
        next(error);
    }
}

export async function getReactionById(req, res, next) {
    try {
        const { course_id, question_id, reaction_id } = req.params;
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
                $unwind: "$questions.reactions",
            },
            {
                $match: {
                    "questions.reactions._id": new mongoose.Types.ObjectId(
                        reaction_id
                    ),
                },
            },
            {
                $project: {
                    _id: 0,
                    type: "$questions.reactions.type",
                    user: "$questions.reactions.user",
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

export async function updateReactionById(req, res, next) {
    try {
        const { course_id, question_id, reaction_id } = req.params;
        const { type } = req.body;

        const result = await courseModel.updateOne(
            {
                _id: course_id,
            },
            {
                $set: {
                    "questions.$[fun1].reactions.$[fun2].type": type,
                },
            },
            {
                arrayFilters: [
                    { "fun1._id": question_id },
                    { "fun2._id": reaction_id },
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

export async function updateReactionByUserId(req, res, next) {
    try {
        const { course_id, question_id } = req.params;
        const user_id = req.token._id;
        const { type } = req.body;

        const result = await courseModel.updateOne(
            {
                _id: course_id,
            },
            {
                $set: {
                    "questions.$[fun1].reactions.$[fun2].type": type,
                },
            },
            {
                arrayFilters: [
                    { "fun1._id": question_id },
                    { "fun2.user._id": user_id },
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

export async function deleteReactionById(req, res, next) {
    try {
        const { course_id, question_id, reaction_id } = req.params;

        const result = await courseModel.updateOne(
            { _id: course_id, "questions._id": question_id },
            {
                $pull: {
                    "questions.$.reactions": {
                        _id: reaction_id,
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

export async function deleteReactionByUserId(req, res, next) {
    try {
        const { course_id, question_id } = req.params;

        const result = await courseModel.updateOne(
            { _id: course_id, "questions._id": question_id },
            {
                $pull: {
                    "questions.$.reactions": {
                        "user._id": req.token._id,
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
