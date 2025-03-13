import { Router } from 'express';
import auth from '../middleware/auth.js';
import { addQuestionController, getAllQuestionsController, deleteQuestionController} from '../controllers/question.controller.js';

const questionRouter = Router();

// Route to add a question
questionRouter.post('/add', auth, addQuestionController);

// Route to get all questions
questionRouter.get('/all', getAllQuestionsController);

// Route to delete a question and its answers
questionRouter.delete("/:questionId", deleteQuestionController);



export default questionRouter;
