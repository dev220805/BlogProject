import { Router } from 'express';
import auth from '../middleware/auth.js';
import { 
    addAnswerController, 
    // getAnswersByQuestion, 
    upvoteAnswer, 
    downvoteAnswer,
   // getAnswersByUser // Import the new controller
} from '../controllers/answer.controller.js';

const router = Router();

// Existing routes
router.post("/add", auth, addAnswerController);
// router.get("/:questionId", getAnswersByQuestion);

// New route to fetch answers by user ID
// router.get("/user/:userId", getAnswersByUser);

// Debugging logs added
router.post("/upvote/:answerId", auth, async (req, res, next) => {
    console.log("Upvote request received:", req.params.answerId);
    next();
}, upvoteAnswer);

router.post("/downvote/:answerId", auth, async (req, res, next) => {
    console.log("Downvote request received:", req.params.answerId);
    next();
}, downvoteAnswer);

export default router;