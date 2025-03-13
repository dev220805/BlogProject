import QuestionModel from '../models/Question.model.js';
import AnswerModel from '../models/Answer.model.js'; 

export const addQuestionController = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("User ID from req.userId:", req.userId);

        const { title, tags } = req.body; // Removed `body` from destructuring
        const userId = req.userId;

        // Validate only the title (since `body` is removed)
        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }

        // Create the new question without the `body` field
        const newQuestion = new QuestionModel({
            title,
            tags: tags || [], // Optional tags
            user: userId,
        });

        await newQuestion.save();
        console.log("Question saved successfully:", newQuestion);

        res.status(201).json({
            message: "Question added successfully",
            question: newQuestion,
        });
    } catch (error) {
        console.error("Error in addQuestionController:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all questions (no changes needed here)
export const getAllQuestionsController = async (req, res) => {
    try {
        const questions = await QuestionModel.find()
            .populate("user", "name avatar")  // Get question author's details
            .populate({
                path: "answers",
                populate: { path: "question", select: "title" } // Show related question
            });

        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteQuestionController = async (req, res) => {
    try {
        const { questionId } = req.params; // Get the question ID from the request parameters

        // Step 1: Find the question to ensure it exists
        const question = await QuestionModel.findById(questionId);
        if (!question) {
            return res.status(404).json({ error: "Question not found" });
        }

        // Step 2: Delete all answers associated with the question
        await AnswerModel.deleteMany({ question: questionId });

        // Step 3: Delete the question
        await QuestionModel.findByIdAndDelete(questionId);

        // Step 4: Send a success response
        res.status(200).json({ message: "Question and associated answers deleted successfully" });
    } catch (error) {
        console.error("Error deleting question:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};