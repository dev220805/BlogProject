import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:8080/api/user/login",
                { email, password },
                { withCredentials: true }
            );

            if (response.data.success) {
                Cookies.set("accessToken", response.data.data.accessToken, { secure: true });
                Cookies.set("refreshToken", response.data.data.refreshToken, { secure: true });

                toast.success("Login successful!");
                setTimeout(() => navigate("/"), 1500);
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        }

        setLoading(false);
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center vh-100"
            style={{ background: "linear-gradient(to right, #667eea, #764ba2)" }}
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
                <h3 className="text-center fw-bold text-primary">Login</h3>

                <form onSubmit={handleLogin}>
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

                    {/* Forgot Password Link */}
                    <div className="text-end mb-3">
                        <Link to="/forgot-password" className="text-decoration-none text-primary fw-bold">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        className="btn w-100 login-btn"
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
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    {/* Register Link */}
                    <p className="text-center mt-2" style={{ color: "black" }}>
                        Don't have an account?{" "}
                        <Link to="/register" className="text-primary fw-bold">
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
