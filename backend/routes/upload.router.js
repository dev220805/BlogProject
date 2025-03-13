import { Router } from 'express';
import auth from '../middleware/auth.js'; // Keep auth unchanged
import uploadImageController from '../controllers/uploadImage.controller.js';
import upload from '../middleware/multer.js';

const uploadRouter = Router();

uploadRouter.post("/upload", auth, upload.single("image"), uploadImageController);

export default uploadRouter;
