import uploadImageClodinary from "../utils/uploadImageClodinary.js";
import UserModel from "../models/user.model.js"; // Import UserModel to update DB

const uploadImageController = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                message: "No file uploaded",
                error: true,
                success: false
            });
        }

        const uploadedImage = await uploadImageClodinary(file);

        // Save image URL to user's profile in the database
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.userId, 
            { avatar: uploadedImage.secure_url }, 
            { new: true } // Return the updated document
        );

        return res.json({
            message: "Upload successful",
            data: uploadedImage.secure_url, // Send Cloudinary URL
            user: updatedUser,
            success: true,
            error: false
        });

    } catch (error) {
        console.error("Upload Error:", error);
        return res.status(500).json({
            message: error.message || "Failed to upload image",
            error: true,
            success: false
        });
    }
};

export default uploadImageController;
