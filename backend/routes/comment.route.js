import { Router } from "express";
import auth from "../middleware/auth.js";
import {
    addCommentController,
    getCommentsByAnswerController,
    deleteCommentController,
} from "../controllers/comment.controller.js";

const router = Router();

// Add a comment to an answer
router.post("/:answerId/add", auth, addCommentController);

// Get all comments for an answer
router.get("/:answerId", getCommentsByAnswerController);

// Delete a comment
router.delete("/:commentId", auth, deleteCommentController);

export default router;