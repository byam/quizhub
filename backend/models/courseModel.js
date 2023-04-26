import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema(
    {
        type: { type: String, enum: ["up", "down"], required: true },
        user: { type: { _id: String, name: String }, required: true },
    },
    { timestamps: true }
);

const commentSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
        user: { type: { _id: String, name: String }, required: true },
        reactions: { type: [reactionSchema], default: [] },
    },
    { timestamps: true }
);

const questionSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
        choices: { type: [String], required: true },
        correctIndex: { type: Number, required: true },
        explanation: String,
        user: { type: { _id: String, name: String }, required: true },
        reactions: { type: [reactionSchema], default: [] },
        comments: { type: [commentSchema], default: [] },
    },
    { timestamps: true }
);

// Add a text index to the question text field
questionSchema.index({ text: "text" });

const courseSchema = new mongoose.Schema(
    {
        course_code: { type: String, required: true },
        title: { type: String, required: true },
        instructor: { type: String, required: true },
        description: String,
        term: { type: Date, required: true },
        user: { type: { _id: String, name: String }, required: true },
        questions: { type: [questionSchema], default: [] },
    },
    { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
