// import { useState, useEffect } from "react";
// import "./QuestionsList.css";

// const QuestionsList = () => {
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [comment, setComment] = useState("");
//   const [expandedComments, setExpandedComments] = useState({});

//   // Fetch Questions and Answers Together
//   useEffect(() => {
//     fetch("http://localhost:8080/api/question/all")
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then((data) => {
//         if (!Array.isArray(data)) {
//           throw new Error("Invalid format received.");
//         }
//         setQuestions(data);
//         setLoading(false);

//         // Fetch comments for all answers
//         data.forEach((question) => {
//           question.answers.forEach((answer) => {
//             fetchComments(answer._id);
//           });
//         });
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);

//   // Fetch comments for a specific answer
//   const fetchComments = async (answerId) => {
//     try {
//       const res = await fetch(
//         `http://localhost:8080/api/comment/${answerId}`,
//         {
//           method: "GET",
//           credentials: "include",
//         }
//       );

//       if (!res.ok) {
//         throw new Error(`Failed to fetch comments. Status: ${res.status}`);
//       }

//       const comments = await res.json(); // Fetches the array of comments directly
//       console.log("Fetched Comments Data:", comments); // Debugging

//       // Update the questions state with the fetched comments
//       setQuestions((prevQuestions) =>
//         prevQuestions.map((question) => ({
//           ...question,
//           answers: question.answers.map((answer) =>
//             answer._id === answerId
//               ? { ...answer, comments } // Directly assign comments array
//               : answer
//           ),
//         }))
//       );
//     } catch (error) {
//       console.error("Error fetching comments:", error);
//       alert(`Error fetching comments: ${error.message}`);
//     }
//   };


//   // Handle voting for answers
//   const handleVote = async (answerId, voteType) => {
//     try {
//       const res = await fetch(
//         `http://localhost:8080/api/answer/${voteType}/${answerId}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         }
//       );

//       if (!res.ok) {
//         if (res.status === 401) {
//           alert("Your session has expired. Please log in again.");
//           return;
//         }
//         throw new Error(`Failed to ${voteType}. Status: ${res.status}`);
//       }

//       const updatedAnswer = await res.json();

//       // Update the questions state with the updated answer
//       setQuestions((prevQuestions) =>
//         prevQuestions.map((question) => ({
//           ...question,
//           answers: question.answers.map((answer) =>
//             answer._id === answerId ? updatedAnswer : answer
//           ),
//         }))
//       );
//     } catch (error) {
//       console.error(`Error ${voteType}ing answer:`, error);
//       alert(`Error ${voteType}ing: ${error.message}`);
//     }
//   };

//   // Handle adding a comment to an answer
//   const handleAddComment = async (answerId) => {
//     try {
//       if (!comment.trim()) {
//         alert("Comment cannot be empty.");
//         return;
//       }

//       const res = await fetch(
//         `http://localhost:8080/api/comment/${answerId}/add`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify({ text: comment }),
//         }
//       );

//       if (!res.ok) {
//         if (res.status === 401) {
//           alert("Your session has expired. Please log in again.");
//           return;
//         }
//         throw new Error(`Failed to add comment. Status: ${res.status}`);
//       }

//       const newComment = await res.json();
//       console.log("New Comment Response:", newComment); // Debugging

//       // Update the questions state with the new comment
//       setQuestions((prevQuestions) =>
//         prevQuestions.map((question) => ({
//           ...question,
//           answers: question.answers.map((answer) =>
//             answer._id === answerId
//               ? {
//                 ...answer,
//                 comments: Array.isArray(answer.comments)
//                   ? [...answer.comments, newComment.comment]
//                   : [newComment.comment], // Initialize comments array if undefined
//               }
//               : answer
//           ),
//         }))
//       );

//       // Clear the comment input
//       setComment("");
//     } catch (error) {
//       console.error("Error adding comment:", error);
//       alert(`Error adding comment: ${error.message}`);
//     }
//   };

//   // Toggle comments section for an answer and fetch comments if expanded
//   const toggleComments = (answerId) => {
//     setExpandedComments((prev) => ({
//       ...prev,
//       [answerId]: !prev[answerId],
//     }));

//     // Fetch comments when the section is expanded
//     if (!expandedComments[answerId]) {
//       fetchComments(answerId);
//     }
//   };

//   if (loading) return <div className="loading">Loading...</div>;
//   if (error) return <div className="error">Error: {error}</div>;

//   return (
//     <div className="questions-container">
//       {questions.length > 0 ? (
//         questions.map((question) => (
//           <div key={question._id} className="question-card">
//             <div className="question-header">
//               <img
//                 src={question.user?.avatar || "/default-avatar.png"}
//                 alt="Avatar"
//                 className="avatar"
//               />
//               <span className="username">
//                 <strong>{question.user?.name || "Anonymous"}</strong>
//               </span>
//             </div>
//             <h3 className="question-title">{question.title}</h3>
//             <div className="answers-section">
//               {question.answers.length > 0 ? (
//                 question.answers.map((answer) => (
//                   <div key={answer._id} className="answer">
//                     <p className="answer-body">{answer.body}</p>
//                     {answer.user?.name && (
//                       <p className="answer-author">- {answer.user.name}</p>
//                     )}
//                     <div className="actions">
//                       <button
//                         className="toggle-comments-btn"
//                         onClick={() => toggleComments(answer._id)}
//                       >
//                         💬 {answer.comments?.length || 0}
//                       </button>

//                       <div className="vote-buttons">
//                         <button onClick={() => handleVote(answer._id, "upvote")}>
//                           👍 {answer.upvotes?.length || 0}
//                         </button>
//                         <button onClick={() => handleVote(answer._id, "downvote")}>
//                           👎 {answer.downvotes?.length || 0}
//                         </button>
//                       </div>
//                     </div>
//                     {expandedComments[answer._id] && (
//                       <div className="comments-section">
//                         <h5>Comments:</h5>
//                         {answer.comments && answer.comments.length > 0 ? (
//                           answer.comments.map((comment) => (
//                             <div key={comment._id} className="comment">
//                               <p className="comment-text">{comment.text}</p>
//                               {comment.user?.name && (
//                                 <p className="comment-author">- {comment.user.name}</p>
//                               )}
//                             </div>
//                           ))
//                         ) : (
//                           <p>No comments yet.</p>
//                         )}
//                         {/* Add Comment Section */}
//                         <div className="add-comment">
//                           <textarea
//                             placeholder="Add a comment..."
//                             value={comment}
//                             onChange={(e) => setComment(e.target.value)}
//                           />
//                           <button onClick={() => handleAddComment(answer._id)}>
//                             Add Comment
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <p>No answers yet.</p>
//               )}
//             </div>
//           </div>
//         ))
//       ) : (
//         <div>No questions available.</div>
//       )}
//     </div>
//   );
// };

// export default QuestionsList;

import { useState, useEffect } from "react";
import "./QuestionsList.css";
import { Toaster, toast } from "react-hot-toast"; // Import React Hot Toast
import { FaUser } from "react-icons/fa";

const QuestionsList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [expandedComments, setExpandedComments] = useState({});

  // Fetch Questions and Answers Together
  useEffect(() => {
    fetch("http://localhost:8080/api/question/all")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Invalid format received.");
        }
        setQuestions(data);
        setLoading(false);

        // Fetch comments for all answers
        data.forEach((question) => {
          question.answers.forEach((answer) => {
            fetchComments(answer._id);
          });
        });
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        toast.error(`Error fetching questions: ${err.message}`); // Toast for fetch error
      });
  }, []);

  // Fetch comments for a specific answer
  const fetchComments = async (answerId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/comment/${answerId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch comments. Status: ${res.status}`);
      }

      const comments = await res.json(); // Fetches the array of comments directly
      console.log("Fetched Comments Data:", comments); // Debugging

      // Update the questions state with the fetched comments
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) => ({
          ...question,
          answers: question.answers.map((answer) =>
            answer._id === answerId
              ? { ...answer, comments } // Directly assign comments array
              : answer
          ),
        }))
      );
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error(`Error fetching comments: ${error.message}`); // Toast for comment fetch error
    }
  };

  // Handle voting for answers
  const handleVote = async (answerId, voteType) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/answer/${voteType}/${answerId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Your session has expired. Please log in again."); // Toast for session expiry
          return;
        }
        throw new Error(`Failed to ${voteType}. Status: ${res.status}`);
      }

      const updatedAnswer = await res.json();

      // Update the questions state with the updated answer
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) => ({
          ...question,
          answers: question.answers.map((answer) =>
            answer._id === answerId ? updatedAnswer : answer
          ),
        }))
      );

      toast.success(`Answer ${voteType}d successfully!`); // Toast for successful vote
    } catch (error) {
      console.error(`Error ${voteType}ing answer:`, error);
      toast.error(`Error ${voteType}ing: ${error.message}`); // Toast for vote error
    }
  };

  // Handle adding a comment to an answer
  const handleAddComment = async (answerId) => {
    try {
      if (!comment.trim()) {
        toast.error("Comment cannot be empty."); // Toast for empty comment
        return;
      }

      const res = await fetch(
        `http://localhost:8080/api/comment/${answerId}/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ text: comment }),
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Your session has expired. Please log in again."); // Toast for session expiry
          return;
        }
        throw new Error(`Failed to add comment. Status: ${res.status}`);
      }

      const newComment = await res.json();
      console.log("New Comment Response:", newComment); // Debugging

      // Update the questions state with the new comment
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) => ({
          ...question,
          answers: question.answers.map((answer) =>
            answer._id === answerId
              ? {
                ...answer,
                comments: Array.isArray(answer.comments)
                  ? [...answer.comments, newComment.comment]
                  : [newComment.comment], // Initialize comments array if undefined
              }
              : answer
          ),
        }))
      );

      // Clear the comment input
      setComment("");
      toast.success("Comment added successfully!"); // Toast for successful comment addition
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error(`Error adding comment: ${error.message}`); // Toast for comment error
    }
  };

  // Toggle comments section for an answer and fetch comments if expanded
  const toggleComments = (answerId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [answerId]: !prev[answerId],
    }));

    // Fetch comments when the section is expanded
    if (!expandedComments[answerId]) {
      fetchComments(answerId);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="questions-container">
      {/* React Hot Toast Container */}
      <Toaster position="top-center" />

      {questions.length > 0 ? (
        questions.map((question) => (
          <div key={question._id} className="question-card">
            <div className="question-header">
              {question.user?.avatar ? (
                <img src={question.user.avatar} alt="Avatar" className="avatar w-10 h-10" />
              ) : (
                <FaUser className="text-gray-500 text-2xl " />
              )}

              <span className="username">
                <strong>{question.user?.name || "Anonymous"}</strong>
              </span>
            </div>
            <h3 className="question-title">{question.title}</h3>
            <div className="answers-section">
              {question.answers.length > 0 ? (
                question.answers.map((answer) => (
                  <div key={answer._id} className="answer">
                    <p className="answer-body">{answer.body}</p>
                    {answer.user?.name && (
                      <p className="answer-author">- {answer.user.name}</p>
                    )}
                    <div className="actions">
                      <button
                        className="toggle-comments-btn"
                        onClick={() => toggleComments(answer._id)}
                      >
                        💬 {answer.comments?.length || 0}
                      </button>

                      <div className="vote-buttons">
                        <button onClick={() => handleVote(answer._id, "upvote")}>
                          👍 {answer.upvotes?.length || 0}
                        </button>
                        <button onClick={() => handleVote(answer._id, "downvote")}>
                          👎 {answer.downvotes?.length || 0}
                        </button>
                      </div>
                    </div>
                    {expandedComments[answer._id] && (
                      <div className="comments-section">
                        <h5>Comments:</h5>
                        {answer.comments && answer.comments.length > 0 ? (
                          answer.comments.map((comment) => (
                            <div key={comment._id} className="comment">
                              <p className="comment-text">{comment.text}</p>
                              {comment.user?.name && (
                                <p className="comment-author">- {comment.user.name}</p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p>No comments yet.</p>
                        )}
                        {/* Add Comment Section */}
                        <div className="add-comment">
                          <textarea
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />
                          <button onClick={() => handleAddComment(answer._id)}>
                            Add Comment
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No answers yet.</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <div>No questions available.</div>
      )}
    </div>
  );
};

export default QuestionsList;