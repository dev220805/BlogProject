import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

const auth = async (req, res, next) => {
    try {
        console.log("Cookies in Request:", req.cookies);
        const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
        console.log("Auth Middleware - Token Received:", token);

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized. No token provided.",
                error: true,
                success: false,
            });
        }

        jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN, (err, decoded) => {
            if (err) {
                console.error("JWT Verification Error:", err);
                return res.status(401).json({
                    message: "Unauthorized access. Invalid token.",
                    error: true,
                    success: false,
                });
            }

            console.log("Token Decoded Successfully:", decoded);
            req.userId = decoded.id;
            next();
        });

    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(500).json({
            message: "You are not logged in",
            error: true,
            success: false,
        });
    }
};


export default auth;