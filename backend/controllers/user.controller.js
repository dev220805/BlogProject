import sendEmail from '../config/sendEmail.js'
import UserModel from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js'
import generatedAccessToken from '../utils/generatedAccessToken.js'
import genertedRefreshToken from '../utils/generatedRefreshToken.js'
import uploadImageClodinary from '../utils/uploadImageClodinary.js'
import generatedOtp from '../utils/generatedOtp.js'
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js'
import jwt from 'jsonwebtoken'

export async function registerUserController(request, response) {
    try {
        const { name, email, password } = request.body;

        if (!name || !email || !password) {
            return response.status(400).json({
                message: "Provide name, email, and password",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (user) {
            return response.status(400).json({ // 👈 Return 400 status code
                message: "Email already registered",
                error: true,
                success: false
            });
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        // Generate OTP
        const otp = generatedOtp(); // Example: 123456
        const hashOtp = await bcryptjs.hash(otp.toString(), salt); // Hash OTP

        // Create user with OTP and expiry time
        const newUser = new UserModel({
            name,
            email,
            password: hashPassword,
            email_verification_otp: hashOtp,
            email_verification_expiry: new Date(Date.now() + 10 * 60 * 1000) // 10 min expiry
        });

        await newUser.save();

        // Send OTP via email
        await sendEmail({
            sendTo: email,
            subject: "Your OTP for Spectra",
            html: verifyEmailTemplate({
                name,
                otp
            })
        });

        return response.status(201).json({ // 👈 Return 201 for successful registration
            message: "User registered successfully. OTP sent to your email",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


export async function verifyEmailController(request, response) {
    try {
        const { email, otp } = request.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // Check if OTP is expired
        if (!user.email_verification_expiry || user.email_verification_expiry < new Date()) {
            return response.status(400).json({
                message: "OTP expired. Request a new one",
                error: true,
                success: false
            });
        }

        // Compare hashed OTP
        const isOtpValid = await bcryptjs.compare(otp.toString(), user.email_verification_otp);

        if (!isOtpValid) {
            return response.status(400).json({
                message: "Invalid OTP",
                error: true,
                success: false
            });
        }

        // Update user verification status
        await UserModel.updateOne(
            { email },
            { verify_email: true, email_verification_otp: null, email_verification_expiry: null }
        );

        return response.json({
            message: "Email verified successfully",
            success: true,
            error: false
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

//login controller
export async function loginController(request, response) {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({
                message: "Provide email and password",
                error: true,
                success: false,
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: "User not registered",
                error: true,
                success: false,
            });
        }


        // if (user.status !== "Active") {
        //     return response.status(400).json({
        //         message: "Contact Admin",
        //         error: true,
        //         success: false,
        //     });
        // }

        const checkPassword = await bcryptjs.compare(password, user.password);

        if (!checkPassword) {
            return response.status(400).json({
                message: "Check your password",
                error: true,
                success: false,
            });
        }

        const accessToken = await generatedAccessToken(user._id);
        const refreshToken = await genertedRefreshToken(user._id);


        await UserModel.findByIdAndUpdate(user._id, {
            refresh_token: refreshToken, // Now it's a string, not a Promise ✅
            last_login_date: new Date(),
        });


        response.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });
        response.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });

        return response.json({
            message: "Login successful",
            error: false,
            success: true,
            data: { accessToken, refreshToken },
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

//logout controller
export async function logoutController(request, response) {
    try {
        const userid = request.userId; // Middleware sets this

        // Clear cookies in response, even if user ID is missing
        response.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "None", maxAge: 0 });
        response.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "None", maxAge: 0 });

        if (!userid) {
            return response.json({
                message: "Logout successful (no user found)",
                error: false,
                success: true
            });
        }

        // Remove refresh token from the database
        const user = await UserModel.findByIdAndUpdate(userid, { $unset: { refresh_token: "" } });

        if (!user) {
            return response.json({
                message: "Logout successful (user not in DB, but tokens cleared)",
                error: false,
                success: true
            });
        }

        return response.json({
            message: "Logout successfully",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

//upload user avatar
// export async function uploadAvatar(req, res) {
//     try {
//         const userId = req.user.id; // Extract from auth middleware
//         const image = req.file; // Extract file from multer

//         if (!image) {
//             return res.status(400).json({
//                 message: "No image uploaded",
//                 success: false,
//                 error: true
//             });
//         }

//         // Upload image to Cloudinary
//         const upload = await uploadImageClodinary(image);

//         if (!upload || !upload.url) {
//             return res.status(500).json({
//                 message: "Error uploading image to Cloudinary",
//                 success: false,
//                 error: true
//             });
//         }

//         // Update user profile with the new avatar
//         const updatedUser = await UserModel.findByIdAndUpdate(
//             userId,
//             { avatar: upload.url },
//             { new: true } // Ensure it returns the updated user
//         );

//         if (!updatedUser) {
//             return res.status(404).json({
//                 message: "User not found",
//                 success: false,
//                 error: true
//             });
//         }

//         return res.json({
//             message: "Profile image uploaded successfully",
//             success: true,
//             error: false,
//             data: {
//                 _id: userId,
//                 avatar: upload.url
//             }
//         });

//     } catch (error) {
//         return res.status(500).json({
//             message: error.message || "Internal Server Error",
//             error: true,
//             success: false
//         });
//     }
// }

export async  function uploadAvatar(request,response){
}

//update user details
export async function updateUserDetails(request, response) {
    try {
        const userId = request.userId //auth middleware
        const { name, email, mobile, password } = request.body

        let hashPassword = ""

        if (password) {
            const salt = await bcryptjs.genSalt(10)
            hashPassword = await bcryptjs.hash(password, salt)
        }

        const updateUser = await UserModel.updateOne({ _id: userId }, {
            ...(name && { name: name }),
            ...(email && { email: email }),
            ...(mobile && { mobile: mobile }),
            ...(password && { password: hashPassword })
        })

        return response.json({
            message: "Updated successfully",
            error: false,
            success: true,
            data: updateUser
        })


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//forgot password not login
export async function forgotPasswordController(request, response) {
    try {
        const { email } = request.body

        const user = await UserModel.findOne({ email })

        if (!user) {
            return response.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            })
        }

        const otp = generatedOtp()
        const expireTime = new Date() + 60 * 60 * 1000 // 1hr

        const update = await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: new Date(expireTime).toISOString()
        })

        await sendEmail({
            sendTo: email,
            subject: "Forgot password from Binkeyit",
            html: forgotPasswordTemplate({
                name: user.name,
                otp: otp
            })
        })

        return response.json({
            message: "check your email",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//verify forgot password otp
export async function verifyForgotPasswordOtp(request, response) {
    try {
        const { email, otp } = request.body

        if (!email || !otp) {
            return response.status(400).json({
                message: "Provide required field email, otp.",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return response.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            })
        }

        const currentTime = new Date().toISOString()

        if (user.forgot_password_expiry < currentTime) {
            return response.status(400).json({
                message: "Otp is expired",
                error: true,
                success: false
            })
        }

        if (otp !== user.forgot_password_otp) {
            return response.status(400).json({
                message: "Invalid otp",
                error: true,
                success: false
            })
        }

        //if otp is not expired
        //otp === user.forgot_password_otp

        const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
            forgot_password_otp: "",
            forgot_password_expiry: ""
        })

        return response.json({
            message: "Verify otp successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//reset the password
export async function resetpassword(request, response) {
    try {
        const { email, newPassword, confirmPassword } = request.body

        if (!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                message: "provide required fields email, newPassword, confirmPassword"
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return response.status(400).json({
                message: "Email is not available",
                error: true,
                success: false
            })
        }

        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: "newPassword and confirmPassword must be same.",
                error: true,
                success: false,
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newPassword, salt)

        const update = await UserModel.findOneAndUpdate(user._id, {
            password: hashPassword
        })

        return response.json({
            message: "Password updated successfully.",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


//refresh token controler
export async function refreshToken(request, response) {
    try {
        const authHeader = request.headers.authorization;
        const refreshToken = request.cookies.refreshToken || (authHeader && authHeader.split(" ")[1]);


        if (!refreshToken) {
            return response.status(401).json({
                message: "Invalid token",
                error: true,
                success: false,
            });
        }

        const verifyToken = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);

        if (!verifyToken) {
            return response.status(401).json({
                message: "Token is expired",
                error: true,
                success: false,
            });
        }

        // Check if refresh token exists in DB
        const user = await UserModel.findById(verifyToken._id);
        if (!user || !user.refresh_token || user.refresh_token !== refreshToken) {
            response.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "None", maxAge: 0 });
            response.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "None", maxAge: 0 });

            return response.status(401).json({
                message: "Invalid or expired refresh token",
                error: true,
                success: false,
            });
        }


        const newAccessToken = generatedAccessToken(user._id);
        response.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });

        return response.json({
            message: "New Access token generated",
            error: false,
            success: true,
            data: { accessToken: newAccessToken },
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

//get login user details
export async function userDetails(request, response) {
    try {
        const userId = request.userId;

        if (!userId) {
            return response.status(401).json({
                message: "Unauthorized. User ID not found.",
                error: true,
                success: false,
            });
        }

        const user = await UserModel.findById(userId).select('-password -refresh_token');

        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        return response.json({
            message: 'User details fetched successfully',
            data: user,
            error: false,
            success: true
        });
    } catch (error) {
        console.error("Error in userDetails:", error); // Log the error
        return response.status(500).json({
            message: "Internal Server Error",
            error: true,
            success: false
        });
    }
}

// Add this new controller function
export async function checkAuthStatus(req, res) {
    try {
        const userId = req.userId; // Extracted from the auth middleware

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
                error: true,
                success: false,
            });
        }

        // Fetch user from database excluding sensitive fields
        const user = await UserModel.findById(userId).select("-password -refresh_token");

        if (!user) {
            return res.status(401).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        return res.status(200).json({
            message: "User is authenticated",
            success: true,
            data: user,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false,
        });
    }
}
