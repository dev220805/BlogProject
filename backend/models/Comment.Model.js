import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who commented
    text: { type: String, required: true },
    answer: { type: mongoose.Schema.Types.ObjectId, ref: "Answer", required: true }, // Only linked to answers
}, { timestamps: true });

const CommentModel = mongoose.model("Comment", commentSchema);
export default CommentModel;
