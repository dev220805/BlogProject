import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyEmail = () => {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get email from query params
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email");

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:8080/api/user/verify-email", { code });

            if (response.data.success) {
                alert("Email verified successfully! You can now log in.");
                navigate("/login");
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid code.");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Verify Email</h2>
            {error && <p className="text-danger">{error}</p>}
            <p>We've sent a verification email to <strong>{email}</strong>. Enter the code below to verify your email.</p>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Verification Code</label>
                    <input type="text" className="form-control" value={code} onChange={(e) => setCode(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-success">Verify</button>
            </form>
        </div>
    );
};

export default VerifyEmail;
