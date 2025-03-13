import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.put(
                "http://localhost:8080/api/user/forgot-password",
                { email }
            );

            if (response.data.success) {
                toast.success("OTP sent! Check your email.");
                setTimeout(() => navigate("/reset-password"), 2000);
            } else {
                toast.error(response.data.message);
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
                <h3 className="text-center fw-bold text-primary">Forgot Password</h3>
                <form onSubmit={handleForgotPassword}>
                    <div className="mb-3">
                        <input type="email" className="form-control p-2"
                               placeholder="Enter your email"
                               value={email} onChange={(e) => setEmail(e.target.value)}
                               required style={{ borderRadius: "10px" }} />
                    </div>
                    <button className="btn w-100" type="submit" disabled={loading}
                            style={{ backgroundColor: "#007bff", color: "#fff", borderRadius: "10px" }}>
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                    <p className="text-center mt-2">
                        Remembered password? <Link to="/login" className="text-primary fw-bold">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
