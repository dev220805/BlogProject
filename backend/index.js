import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import uploadRouter from './routes/upload.router.js';
import connectDB from './config/connectDB.js';
import userRouter from './routes/user.route.js';
import questionRouter from './routes/question.route.js';
import answerRouter from './routes/answer.route.js';
import commentRouter from "./routes/comment.route.js";
const app = express();

app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging setup with morgan (use combined format to avoid deprecated warnings)
app.use(morgan('combined'));

// Security setup with helmet (disable cross-origin resource policy)
app.use(helmet({ crossOriginResourcePolicy: false }));

// Correct PORT setup: Use process.env.PORT if available, fallback to 8080
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.json({ message: "Server is running on port " + PORT });
});

// Route setup
app.use('/api/user', userRouter);
app.use('/api/question', questionRouter); 
app.use('/api/answer', answerRouter); 
app.use("/api/file",uploadRouter);
app.use("/api/comment", commentRouter);

// Database connection and server start
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on port", PORT);
    });
});
