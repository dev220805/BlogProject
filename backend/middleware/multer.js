import multer from 'multer';

const storage = multer.memoryStorage(); // Store in memory for buffer access

const upload = multer({ storage });

export default upload;
