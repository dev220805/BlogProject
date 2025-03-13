import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
            setLoading(false);
            return;
        }

        try {
            // Verify OTP
            const verifyResponse = await axios.put(
                "http://localhost:8080/api/user/verify-forgot-password-otp",
                { email, otp }
            );

            if (!verifyResponse.data.success) {
                toast.error(verifyResponse.data.message);
                setLoading(false);
                return;
            }

            // Reset Password
            const resetResponse = await axios.put(
                "http://localhost:8080/api/user/reset-password",
                { email, newPassword, confirmPassword }
            );

            if (resetResponse.data.success) {
                toast.success("Password updated successfully!");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                toast.error(resetResponse.data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        }

        setLoading(false);
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100"
             style={{ background: "linear-gradient(to right, #667eea, #764ba2)" }}>
            <Toaster position="top-center" />
            <div className="card p-4 shadow-lg" style={{ width: "400px", borderRadius: "15px" }}>
                <h3 className="text-center fw-bold text-primary">Reset Password</h3>
                <form onSubmit={handleResetPassword}>
                    <div className="mb-3">
                        <input type="email" className="form-control p-2"
                               placeholder="Enter your email"
                               value={email} onChange={(e) => setEmail(e.target.value)}
                               required style={{ borderRadius: "10px" }} />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control p-2"
                               placeholder="Enter OTP"
                               value={otp} onChange={(e) => setOtp(e.target.value)}
                               required style={{ borderRadius: "10px" }} />
                    </div>
                    <div className="mb-3">
                        <input type="password" className="form-control p-2"
                               placeholder="New Password"
                               value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                               required style={{ borderRadius: "10px" }} />
                    </div>
                    <div className="mb-3">
                        <input type="password" className="form-control p-2"
                               placeholder="Confirm Password"
                               value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                               required style={{ borderRadius: "10px" }} />
                    </div>
                    <button className="btn w-100" type="submit" disabled={loading}
                            style={{ backgroundColor: "#007bff", color: "#fff", borderRadius: "10px" }}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
