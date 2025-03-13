// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Toaster, toast } from "react-hot-toast";

// const Profile = () => {
//     const [user, setUser] = useState(null);
//     const [activity, setActivity] = useState([]); // Combined questions and answers
//     const [loading, setLoading] = useState(true); // Loading state
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchUserData();
//     }, []);

//     // Fetch user details
//     const fetchUserData = async () => {
//         try {
//             const response = await axios.get("http://localhost:8080/api/user/user-details", { withCredentials: true });
//             if (response.data.success) {
//                 setUser(response.data.data);
//                 fetchUserActivity(response.data.data._id); // Fetch user activity
//             } else {
//                 toast.error("Failed to load profile");
//             }
//         } catch (err) {
//             toast.error("Please login first");
//             navigate("/login");
//         }
//     };

//     // Fetch user activity (questions and answers)
//     const fetchUserActivity = async (userId) => {
//         try {
//             const response = await axios.get("http://localhost:8080/api/question/all");
//             console.log("API Response:", response.data); // Log the response
//             if (response.data) {
//                 // Filter questions and answers for the logged-in user
//                 const userQuestions = response.data.filter(
//                     (question) => question.user && question.user._id === userId
//                 );

//                 const userAnswers = response.data
//                     .flatMap((question) =>
//                         question.answers.filter(
//                             (answer) => answer.user && answer.user._id === userId
//                         )
//                     )
//                     .map((answer) => ({ ...answer, type: "answer" }));

//                 // Combine questions and answers into a single array
//                 const combinedActivity = [
//                     ...userQuestions.map((q) => ({ ...q, type: "question" })),
//                     ...userAnswers,
//                 ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//                 console.log("Combined Activity:", combinedActivity); // Log combined activity
//                 setActivity(combinedActivity);
//             } else {
//                 toast.error("Failed to load user activity");
//             }
//         } catch (error) {
//             console.error("Error fetching user activity:", error);
//             toast.error("Failed to load user activity");
//         } finally {
//             setLoading(false); // Set loading to false after fetching
//         }
//     };

//     return (
//         <div className="container mt-5">
//             <Toaster position="top-center" />
//             {user ? (
//                 <div className="card p-4 shadow-lg" style={{ borderRadius: "15px" }}>
//                     {/* User Profile Section */}
//                     <div className="d-flex align-items-center">
//                         <img
//                             src={user.avatar || "/default-avatar.png"} // Fallback avatar
//                             alt="User Avatar"
//                             className="rounded-circle"
//                             style={{ width: "100px", height: "100px", objectFit: "cover" }}
//                         />
//                         <div className="ms-4">
//                             <h3 className="fw-bold">{user.name}</h3>
//                             <p className="text-muted">{user.email}</p>
//                             <button className="btn btn-primary btn-sm" onClick={() => navigate("/edit-profile")}>
//                                 Edit Profile
//                             </button>
//                         </div>
//                     </div>

//                     {/* Activity Count Section (Only show if there are questions or answers) */}
//                     {(activity.filter(a => a.type === 'question').length > 0 || activity.filter(a => a.type === 'answer').length > 0) && (
//                         <div className="d-flex justify-content-between mt-4">
//                             {activity.filter(a => a.type === 'question').length > 0 && (
//                                 <div className="text-center">
//                                     <h4 className="fw-bold">{activity.filter(a => a.type === 'question').length}</h4>
//                                     <p className="text-muted">Questions</p>
//                                 </div>
//                             )}
//                             {activity.filter(a => a.type === 'answer').length > 0 && (
//                                 <div className="text-center">
//                                     <h4 className="fw-bold">{activity.filter(a => a.type === 'answer').length}</h4>
//                                     <p className="text-muted">Answers</p>
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {/* User Activity Section */}
//                     <div className="mt-4">
//                         <h4 className="fw-bold">Your Activity</h4>
//                         {loading ? (
//                             <p className="text-muted">Loading activity...</p>
//                         ) : activity.length > 0 ? (
//                             activity.map((item) => (
//                                 <div key={item._id} className="card p-3 mt-3 shadow-sm" style={{ borderRadius: "10px" }}>
//                                     {item.type === 'question' ? (
//                                         <>
//                                             <h6 className="fw-bold">{item.title}</h6> {/* Display question title */}
//                                             {item.answers.length > 0 && (
//                                                 <p className="mb-2">{item.answers[0].body}</p> 
//                                             )}
//                                             <p className="text-muted mb-2">Posted on: {new Date(item.createdAt).toLocaleDateString()}</p>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <p className="mb-2">{item.body}</p> {/* Display answer body */}
//                                             <p className="text-muted mb-2">Answered on: {new Date(item.createdAt).toLocaleDateString()}</p>
//                                             <div className="d-flex align-items-center">
//                                                 <span className="text-muted">To: {item.question.title}</span>
//                                             </div>
//                                         </>
//                                     )}
//                                 </div>
//                             ))
//                         ) : (
//                             <p className="text-muted">You haven't posted any questions or answers yet.</p>
//                         )}
//                     </div>
//                 </div>
//             ) : (
//                 <p className="text-center">Loading profile...</p>
//             )}
//         </div>
//     );
// };

// export default Profile;

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { FaTrash } from "react-icons/fa"; // Import trash icon from react-icons
import "./Profile.css"; // Import the updated CSS file

const Profile = () => {
    const [user, setUser] = useState(null);
    const [activity, setActivity] = useState([]); // Combined questions and answers
    const [loading, setLoading] = useState(true); // Loading state
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [selectedItem, setSelectedItem] = useState(null); // Selected question/answer to delete
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
    }, []);

    // Fetch user details
    const fetchUserData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/user/user-details", { withCredentials: true });
            if (response.data.success) {
                setUser(response.data.data);
                fetchUserActivity(response.data.data._id); // Fetch user activity
            } else {
                toast.error("Failed to load profile");
            }
        } catch (err) {
            toast.error("Please login first");
            navigate("/login");
        }
    };

    // Fetch user activity (questions and answers)
    const fetchUserActivity = async (userId) => {
        try {
            const response = await axios.get("http://localhost:8080/api/question/all");
            console.log("API Response:", response.data); // Log the response
            if (response.data) {
                // Filter questions and answers for the logged-in user
                const userQuestions = response.data.filter(
                    (question) => question.user && question.user._id === userId
                );

                const userAnswers = response.data
                    .flatMap((question) =>
                        question.answers.filter(
                            (answer) => answer.user && answer.user._id === userId
                        )
                    )
                    .map((answer) => ({ ...answer, type: "answer" }));

                // Combine questions and answers into a single array
                const combinedActivity = [
                    ...userQuestions.map((q) => ({ ...q, type: "question" })),
                    ...userAnswers,
                ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                console.log("Combined Activity:", combinedActivity); // Log combined activity
                setActivity(combinedActivity);
            } else {
                toast.error("Failed to load user activity");
            }
        } catch (error) {
            console.error("Error fetching user activity:", error);
            toast.error("Failed to load user activity");
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    // Handle delete confirmation
    const handleDelete = async () => {
        try {
            if (selectedItem) {
                // Delete the question or answer
                if (selectedItem.type === "question") {
                    await axios.delete(`http://localhost:8080/api/question/${selectedItem._id}`);
                } else if (selectedItem.type === "answer") {
                    await axios.delete(`http://localhost:8080/api/answer/${selectedItem._id}`);
                }

                // Refresh the activity list
                fetchUserActivity(user._id);
                toast.success("Deleted successfully");
            }
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Failed to delete");
        } finally {
            setShowModal(false); // Close the modal
            setSelectedItem(null); // Reset selected item
        }
    };

    return (
        <div className="container mt-5" style={{ backgroundColor: 'black', minHeight: '100vh', padding: '20px' }}>
            <Toaster position="top-center" />
            {user ? (
                <div className="card p-4 shadow-lg" style={{ borderRadius: "15px" }}>
                    {/* User Profile Section */}
                    <div className="d-flex align-items-center">
                        <img
                            src={user.avatar || "/default-avatar.png"} // Fallback avatar
                            alt="User Avatar"
                            className="rounded-circle"
                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        />
                        <div className="ms-4">
                            <h3 className="fw-bold">{user.name}</h3>
                            <p className="text-muted">{user.email}</p>
                            <button className="btn btn-primary btn-sm" onClick={() => navigate("/edit-profile")}>
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    {/* Activity Count Section */}
                    {/* {(activity.filter(a => a.type === 'question').length > 0 || activity.filter(a => a.type === 'answer').length > 0) && (
                        <div className="d-flex justify-content-between mt-4">
                            {activity.filter(a => a.type === 'question').length > 0 && (
                                <div className="text-center">
                                    <h4 className="fw-bold">{activity.filter(a => a.type === 'question').length}</h4>
                                    <p className="text-muted"  style={{ color: "black" }}>Questions</p>
                                </div>
                            )}
                            {activity.filter(a => a.type === 'answer').length > 0 && (
                                <div className="text-center">
                                    <h4 className="fw-bold">{activity.filter(a => a.type === 'answer').length}</h4>
                                    <p className="text-muted">Answers</p>
                                </div>
                            )}
                        </div>
                    )} */}

                    {/* User Activity Section */}
                    <div className="mt-4">
                        <h4 className="fw-bold">Your Activity</h4>
                        {loading ? (
                            <p className="text-muted">Loading activity...</p>
                        ) : activity.length > 0 ? (
                            activity.map((item) => (
                                <div
                                    key={item._id}
                                    className="card p-3 mt-3 shadow-sm position-relative"
                                    style={{ borderRadius: "10px", transition: "background-color 0.3s" }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = "#2c2c2c"; // Darker gray on hover
                                        e.currentTarget.querySelector(".delete-button").style.opacity = 1;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "#1e1e1e"; // Reset to dark gray
                                        e.currentTarget.querySelector(".delete-button").style.opacity = 0;
                                    }}
                                >
                                    {/* Dustbin Button (Visible on Hover) */}
                                    <button
                                        className="btn btn-link position-absolute top-50 end-0 translate-middle-y p-2 delete-button"
                                        style={{ opacity: 0, transition: "opacity 0.3s", color: "#6c757d" }}
                                        onClick={() => {
                                            setSelectedItem(item);
                                            setShowModal(true);
                                        }}
                                    >
                                        <FaTrash style={{ fontSize: "1.2rem" }} />
                                    </button>

                                    {item.type === 'question' ? (
                                        <>
                                            <h6 className="fw-bold">{item.title}</h6> {/* Display question title */}
                                            {item.answers.length > 0 && (
                                                <p className="mb-2" style={{ marginRight: '40px' }}>{item.answers[0].body}</p>
                                            )}
                                            <p className="text-muted mb-2">Posted on: {new Date(item.createdAt).toLocaleDateString()}</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="mb-2" style={{ marginRight: '40px' }}>{item.body}</p> {/* Display answer body */}
                                            <p className="text-muted mb-2">Answered on: {new Date(item.createdAt).toLocaleDateString()}</p>
                                            <div className="d-flex align-items-center">
                                                <span className="text-muted">To: {item.question.title}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-muted">You haven't posted any questions or answers yet.</p>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-center">Loading profile...</p>
            )}

            {/* Confirmation Modal */}
            {showModal && (
                <div
                    className="modal"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black overlay
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1050, // Ensure the modal is on top
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div
                            className="modal-content"
                            style={{
                                backgroundColor: "black", // Black background for the modal
                                color: "white", // White text for better contrast
                                border: "1px solid #333", // Add a subtle border
                            }}
                        >
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                    style={{ filter: "invert(1)" }} // Invert the close button color for visibility
                                ></button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete this {selectedItem?.type}?
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                    style={{ backgroundColor: "#333", border: "none" }} // Dark gray for the cancel button
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDelete}
                                    style={{ backgroundColor: "#dc3545", border: "none" }} // Red for the delete button
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;