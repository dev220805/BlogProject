import mongoose from "mongoose";

// const questionSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     body: { type: String, required: true },
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Only this user can answer
//     tags: [{ type: String }],
//     answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }], // Answers linked to this question
//     upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who upvoted
//     downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who downvoted
//     comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Linked comments
// }, { timestamps: true });

// const QuestionModel = mongoose.model("Question", questionSchema);
// export default QuestionModel;

const questionSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Only title is required
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tags: [{ type: String }],
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
}, { timestamps: true });

const QuestionModel = mongoose.model("Question", questionSchema);
export default QuestionModel;