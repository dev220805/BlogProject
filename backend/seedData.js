import connectDB from './config/connectDB.js';
import mongoose from 'mongoose';  // Import mongoose
import UserModel from './models/user.model.js'; // Import User Model
import QuestionModel from './models/Question.model.js'; // Import Question Model
import AnswerModel from './models/Answer.model.js'; // Import Answer Model

// Sample data for users, questions, and answers
const users = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    verify_email: true,
    last_login_date: new Date(),
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password456",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    verify_email: true,
    last_login_date: new Date(),
  },
];

const questions = [
  {
    title: "How do I use MongoDB with Node.js?",
    body: "I'm trying to integrate MongoDB with my Node.js application. Can anyone provide a sample example?",
    user: "", // Will update after users are added
    tags: ["MongoDB", "Node.js", "Database"],
    upvotes: [],
    downvotes: [],
  },
  {
    title: "What is the difference between var, let, and const?",
    body: "Can anyone explain the differences between var, let, and const in JavaScript?",
    user: "", // Will update after users are added
    tags: ["JavaScript", "Programming"],
    upvotes: [],
    downvotes: [],
  },
];

const answers = [
  {
    body: "To use MongoDB with Node.js, you can use the Mongoose library. Here's an example of connecting to a MongoDB database using Mongoose.",
    user: "", // Will update after users are added
    question: "", // Will update after questions are added
    upvotes: [],
    downvotes: [],
  },
  {
    body: "The key difference between var, let, and const is their scope and mutability. 'var' is function-scoped, 'let' and 'const' are block-scoped. 'const' variables cannot be reassigned.",
    user: "", // Will update after users are added
    question: "", // Will update after questions are added
    upvotes: [],
    downvotes: [],
  },
];

const seedData = async () => {
  try {
    await connectDB(); // Connect to the database

    // Add Users to DB
    const userDocs = await UserModel.insertMany(users);
    console.log("Users added:", userDocs);

    // Update Questions with User IDs
    questions[0].user = userDocs[0]._id;
    questions[1].user = userDocs[1]._id;

    // Add Questions to DB
    const questionDocs = await QuestionModel.insertMany(questions);
    console.log("Questions added:", questionDocs);

    // Update Answers with User and Question IDs
    answers[0].user = userDocs[0]._id;
    answers[0].question = questionDocs[0]._id;

    answers[1].user = userDocs[1]._id;
    answers[1].question = questionDocs[1]._id;

    // Add Answers to DB
    const answerDocs = await AnswerModel.insertMany(answers);
    console.log("Answers added:", answerDocs);

    // Close the database connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting data:", error);
  }
};

// Call the seed function
seedData();
