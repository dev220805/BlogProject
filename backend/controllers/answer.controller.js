import AnswerModel from '../models/Answer.model.js';
import QuestionModel from '../models/Question.model.js';
import mongoose from "mongoose";

// Add an answer
export const addAnswerController = async (req, res) => {
    console.log("Received body:", req.body);
    try {
        const { body, questionId } = req.body;
        const userId = req.userId;

        if (!body || !questionId) {
            return res.status(400).json({ error: "Body and questionId are required" });
        }

        // Check if the question exists
        const question = await QuestionModel.findById(questionId);
        if (!question) {
            return res.status(404).json({ error: "Question not found" });
        }

        // Check if the current user is the question's author
        if (question.user.toString() !== userId) {
            return res.status(403).json({ error: "You can only answer your own question" });
        }

        // Create the answer
        const newAnswer = new AnswerModel({ body, question: questionId });
        await newAnswer.save();

        // Link the answer to the question
        console.log("Before pushing answer:", question.answers); // Debug log
        question.answers.push(newAnswer._id);
        console.log("After pushing answer:", question.answers); // Debug log

        await question.save();
        console.log("Question updated successfully"); // Debug log

        res.status(201).json({ message: "Answer added successfully", answer: newAnswer });
    } catch (error) {
        console.error("Error in addAnswerController:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// export const getAnswersByQuestion = async (req, res) => {
//     try {
//         const { questionId } = req.params;
//         console.log("Fetching answers for questionId:", questionId); // Debug log

//         // Validate questionId
//         if (!mongoose.Types.ObjectId.isValid(questionId)) {
//             return res.status(400).json({ error: "Invalid questionId" });
//         }

//         // Fetch answers for the specific question
//         const answers = await AnswerModel.find({ question: questionId })
//             .populate("question", "title") // Populate the linked question (only title)
//             .populate("comments", "text user") // Populate comments (text and user)
//             .populate("upvotes", "name avatar") // Populate upvotes (name and avatar)
//             .populate("downvotes", "name avatar"); // Populate downvotes (name and avatar)

//         console.log("Fetched answers:", answers); // Debug log

//         if (answers.length === 0) {
//             return res.status(404).json({ error: "No answers found for this question" });
//         }

//         res.status(200).json(answers);
//     } catch (error) {
//         console.error("Error in getAnswersByQuestion:", error); // Debug log
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };

// Upvote an Answer

export const upvoteAnswer = async (req, res) => {
    try {
        const { answerId } = req.params;
        const userId = req.userId; // Fix: Consistently using req.userId

        const answer = await AnswerModel.findById(answerId);
        if (!answer) {
            return res.status(404).json({ error: "Answer not found" });
        }

        // Remove user from downvotes if they already downvoted
        answer.downvotes = answer.downvotes.filter(id => id.toString() !== userId);

        if (answer.upvotes.includes(userId)) {
            answer.upvotes = answer.upvotes.filter(id => id.toString() !== userId);
        } else {
            answer.upvotes.push(userId);
        }

        await answer.save();
        const updatedAnswer = await answer.populate("upvotes", "name avatar");
        res.json(updatedAnswer);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const downvoteAnswer = async (req, res) => {
    try {
        const { answerId } = req.params;
        const userId = req.userId; // Fix: Consistently using req.userId

        const answer = await AnswerModel.findById(answerId);
        if (!answer) {
            return res.status(404).json({ error: "Answer not found" });
        }

        // Remove user from upvotes if they already upvoted
        answer.upvotes = answer.upvotes.filter(id => id.toString() !== userId);

        if (answer.downvotes.includes(userId)) {
            answer.downvotes = answer.downvotes.filter(id => id.toString() !== userId);
        } else {
            answer.downvotes.push(userId);
        }

        await answer.save();
        const updatedAnswer = await answer.populate("downvotes", "name avatar");
        res.json(updatedAnswer);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};




//export const addAnswerController = async (req, res) => {
//     console.log("Received body:", req.body);
//     try {
//         const { body, questionId } = req.body;
//         const userId = req.userId; // Get the user ID from the request

//         if (!body || !questionId) {
//             return res.status(400).json({ error: "Body and questionId are required" });
//         }

//         // Check if the question exists
//         const question = await QuestionModel.findById(questionId);
//         if (!question) {
//             return res.status(404).json({ error: "Question not found" });
//         }

//         // Check if the current user is the question's author
//         if (question.user.toString() !== userId) {
//             return res.status(403).json({ error: "You can only answer your own question" });
//         }

//         // Create the answer with the user field
//         const newAnswer = new AnswerModel({ 
//             body, 
//             question: questionId, 
//             user: userId // Add the user field
//         });
//         await newAnswer.save();

//         // Link the answer to the question
//         console.log("Before pushing answer:", question.answers); // Debug log
//         question.answers.push(newAnswer._id);
//         console.log("After pushing answer:", question.answers); // Debug log

//         await question.save();
//         console.log("Question updated successfully"); // Debug log

//         res.status(201).json({ message: "Answer added successfully", answer: newAnswer });
//     } catch (error) {
//         console.error("Error in addAnswerController:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };


// Get all answers for a specific question