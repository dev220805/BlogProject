import CommentModel from "../models/Comment.Model.js";
import AnswerModel from "../models/Answer.model.js";

// Add a comment to an answer
export const addCommentController = async (req, res) => {
    try {
        const { answerId } = req.params;
        const { text } = req.body;
        const userId = req.userId; // User ID from the auth middleware

        // Validate input
        if (!text) {
            return res.status(400).json({ error: "Comment text is required." });
        }

        // Check if the answer exists
        const answer = await AnswerModel.findById(answerId);
        if (!answer) {
            return res.status(404).json({ error: "Answer not found." });
        }

        // Create the comment
        const newComment = new CommentModel({
            user: userId,
            text,
            answer: answerId,
        });

        // Save the comment
        await newComment.save();

        // Add the comment to the answer's comments array
        answer.comments.push(newComment._id);
        await answer.save();

        // Populate user details in the response
        const populatedComment = await CommentModel.findById(newComment._id)
            .populate("user", "name avatar")
            .exec();

        res.status(201).json({
            message: "Comment added successfully.",
            comment: populatedComment,
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all comments for an answer
export const getCommentsByAnswerController = async (req, res) => {
    try {
        const { answerId } = req.params;

        // Check if the answer exists
        const answer = await AnswerModel.findById(answerId);
        if (!answer) {
            return res.status(404).json({ error: "Answer not found." });
        }

        // Get all comments for the answer
        const comments = await CommentModel.find({ answer: answerId })
            .populate("user", "name avatar") // Populate user details
            .exec();

        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete a comment
export const deleteCommentController = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.userId; // User ID from the auth middleware

        // Find the comment
        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found." });
        }

        // Check if the user is the owner of the comment
        if (comment.user.toString() !== userId) {
            return res.status(403).json({ error: "You are not authorized to delete this comment." });
        }

        // Find the associated answer
        const answer = await AnswerModel.findById(comment.answer);
        if (!answer) {
            return res.status(404).json({ error: "Associated answer not found." });
        }

        // Remove the comment ID from the answer's comments array
        answer.comments = answer.comments.filter(
            (id) => id.toString() !== commentId
        );
        await answer.save();

        // Delete the comment
        await CommentModel.findByIdAndDelete(commentId);

        res.status(200).json({ message: "Comment deleted successfully." });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};