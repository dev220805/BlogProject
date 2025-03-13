import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [disableResend, setDisableResend] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const startOtpTimer = () => {
        setDisableResend(true);
        setCountdown(60);
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(timer);
                    setDisableResend(false);
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            toast.error("Passwords do not match. Please check and try again.");
            setLoading(false);
            return; // Stop further execution
        }

        try {
            const res = await axios.post("http://localhost:8080/api/user/register", {
                name,
                email,
                password,
            });

            console.log("Server Response:", res.data); // Debugging

            if (res.data.success) {
                toast.success("OTP sent to your email. Please enter the OTP.");
                setStep(2);
                startOtpTimer();
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error("Error Response:", error.response?.data); // Debugging

            const errorMessage = error.response?.data?.message || "Registration failed";
            toast.error(errorMessage);

            // Handle the "User already registered" case
            if (errorMessage.toLowerCase().includes("already registered")) {
                alert("This email is already registered. Please log in.");
            }
        }
        setLoading(false);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:8080/api/user/verify-email", {
                email,
                otp,
            });

            if (res.data.success) {
                toast.success("Email verified successfully! Redirecting to login...");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            } else {
                toast.error("Invalid OTP. Please try again.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Verification failed");
        }
        setLoading(false);
    };

    const handleResendOtp = async () => {
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:8080/api/user/resend-otp", {
                email,
            });

            if (res.data.success) {
                toast.success("OTP resent successfully!");
                startOtpTimer(); // Restart the countdown
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to resend OTP");
        }
        setLoading(false);
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center vh-100"
            style={{
                background: "linear-gradient(to right, #667eea, #764ba2)",
            }}
        >
            <Toaster position="top-center" reverseOrder={false} />
            <div
                className="card shadow-lg p-4"
                style={{
                    width: "400px",
                    borderRadius: "15px",
                    background: "#fff",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                }}
            >
                <h3 className="text-center fw-bold text-primary">
                    {step === 1 ? "Register" : "Verify OTP"}
                </h3>

                {step === 1 ? (
                    <form onSubmit={handleRegister}>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control p-2"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                style={{ borderRadius: "10px" }}
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control p-2"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ borderRadius: "10px" }}
                            />
                        </div>
                        <div className="mb-3 position-relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control p-2"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ borderRadius: "10px" }}
                            />
                            <span
                                className="position-absolute top-50 end-0 translate-middle-y me-3"
                                style={{ cursor: "pointer" }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash color="#555" /> : <FaEye color="#555" />}
                            </span>
                        </div>
                        <div className="mb-3 position-relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="form-control p-2"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                style={{ borderRadius: "10px" }}
                            />
                            <span
                                className="position-absolute top-50 end-0 translate-middle-y me-3"
                                style={{ cursor: "pointer" }}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <FaEyeSlash color="#555" />
                                ) : (
                                    <FaEye color="#555" />
                                )}
                            </span>
                        </div>
                        <button
                            className="btn w-100 register-btn"
                            type="submit"
                            disabled={loading}
                            style={{
                                backgroundColor: "#007bff",
                                color: "#fff",
                                fontWeight: "bold",
                                borderRadius: "10px",
                                transition: "0.3s",
                            }}
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>

                        {/* Small Log In Link */}
                        <p className="text-center mt-2" style={{ color: "black" }}>
                            Already have an account?{" "}
                            <Link to="/login" className="text-primary fw-bold">
                                Log in
                            </Link>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control p-2"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                style={{ borderRadius: "10px" }}
                            />
                        </div>
                        <button
                            className="btn w-100"
                            type="submit"
                            disabled={loading}
                            style={{
                                backgroundColor: "#28a745",
                                color: "#fff",
                                fontWeight: "bold",
                                borderRadius: "10px",
                                transition: "0.3s",
                            }}
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                        <p className="text-center mt-3" style={{ color: "black" }}>
                            {disableResend ? (
                                `Resend OTP in ${countdown} seconds`
                            ) : (
                                <button
                                    type="button"
                                    className="btn btn-link p-0"
                                    onClick={handleResendOtp}
                                    disabled={loading}
                                    // style={{ color: "black" }}
                                >
                                    Resend OTP
                                </button>
                            )}
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Register;