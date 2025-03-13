import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    body: { type: String, required: true },
    question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true }, // Linked question
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who upvoted
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who downvoted
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Linked comments
}, { timestamps: true });

const AnswerModel = mongoose.model("Answer", answerSchema);
export default AnswerModel;

