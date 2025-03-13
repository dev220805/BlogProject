import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
    const [user, setUser] = useState({ name: "", email: "", avatar: "" });
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/user/user-details", {
                    withCredentials: true,
                });
                if (response.data.success) {
                    setUser(response.data.data);
                }
            } catch (error) {
                setMessage("Failed to load user details.");
            }
        };
        fetchUser();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage("");

        if (newPassword && newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", user.name);
            formData.append("email", user.email);
            if (newPassword) formData.append("newPassword", newPassword);
            if (avatarFile) formData.append("avatar", avatarFile);

            const response = await axios.put("http://localhost:8080/api/user/update-user", formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                setMessage("Profile updated successfully!");
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4" style={{ width: "400px" }}>
                <h2 className="text-center">Edit Profile</h2>
                {message && <div className="alert alert-info">{message}</div>}
                <form onSubmit={handleUpdateProfile}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Change Avatar</label>
                        <input type="file" className="form-control" onChange={(e) => setAvatarFile(e.target.files[0])} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">New Password</label>
                        <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Update Profile</button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
