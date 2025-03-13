import axios from "axios";
import React, { useState, useEffect } from "react";
import "./Navbar.css";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import toast, { Toaster } from "react-hot-toast"; // React Hot Toast for alerts

axios.defaults.withCredentials = true;

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false); // State for Add Question Modal
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [answerBody, setAnswerBody] = useState(""); // State for answer body
  const navigate = useNavigate();

  /** Function to check authentication */
  const checkAuth = async () => {
    try {
      console.log("Checking authentication...");
      const response = await axios.get("http://localhost:8080/api/user/auth/check");

      console.log("Auth response:", response.data);

      if (response.data.success) {
        setIsLoggedIn(true);
        setUser(response.data.data);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error.response?.data || error.message);
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      await axios.get("http://localhost:8080/api/user/logout");

      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setIsLoggedIn(false);
      setUser(null);
      setAnchorEl(null);
      toast.success("Logged out successfully!"); // Toast notification
      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out. Please try again."); // Toast notification
    }
  };

  const handleAccountClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClosePopper = () => {
    setAnchorEl(null);
  };

  const handleAddQuestionClick = () => {
    if (!isLoggedIn) {
      toast.error("Please log in to add a question."); // Toast notification
      return;
    }
    setOpenModal(true); // Open the modal for adding a question
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setTitle("");
    setTags("");
    setAnswerBody(""); // Reset answer body
  };

  const handleSubmitQuestion = async () => {
    try {
      if (!title) {
        toast.error("Title is required.");
        return;
      }

      console.log("Submitting question with payload:", {
        title,
        tags: tags.split(",").map((tag) => tag.trim()),
      });

      // Step 1: Add the question
      const questionResponse = await axios.post(
        "http://localhost:8080/api/question/add",
        {
          title,
          tags: tags.split(",").map((tag) => tag.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      console.log("Question submitted:", questionResponse.data);

      // Step 2: Add an answer to the question
      const questionId = questionResponse.data.question._id; // Get the question ID from the response

      if (answerBody) {
        const answerResponse = await axios.post(
          "http://localhost:8080/api/answer/add",
          {
            body: answerBody,
            questionId: questionId,
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
          }
        );

        console.log("Answer submitted:", answerResponse.data);
      }

      // Show a single success toast
      toast.success("Question and answer added successfully!", {
        duration: 3000, // Duration in milliseconds
        position: "top-center", // Position of the toast
        style: {
          background: "#4CAF50", // Green background
          color: "#fff", // White text
          borderRadius: "8px", // Rounded corners
          padding: "16px", // Padding
          fontSize: "14px", // Font size
        },
      });

      handleCloseModal();
    } catch (error) {
      console.error("Error submitting question or answer:", error);
      console.error("Error response:", error.response?.data || error.message);

      // Show an error toast
      toast.error("Failed to add question or answer. Please try again.", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#FF5252", // Red background
          color: "#fff", // White text
          borderRadius: "8px",
          padding: "16px",
          fontSize: "14px",
        },
      });
    }
  };

  return (
    <>
      {/* React Hot Toast Container */}
      <Toaster position="top-center" reverseOrder={false} />

      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          {/* Mobile View */}
          <div className="d-flex align-items-center w-100 d-lg-none">
            <button
              className="navbar-toggler border-0"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasNavbar"
              aria-controls="offcanvasNavbar"
            >
              <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
            </button>

            <a className="navbar-brand fw-bold text-light mx-auto ps-5" href="#">
              Spectra
            </a>

            <div className="ms-auto">
              <button type="button" className="btn btn-secondary" onClick={handleAccountClick}>
                <i className="bi bi-person fs-4"></i>
              </button>
            </div>
          </div>

          {/* Offcanvas Menu for Mobile (Hidden on Larger Screens) */}
          <div
            className="offcanvas offcanvas-start bg-dark d-lg-none"
            tabIndex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title text-light" id="offcanvasNavbarLabel">
                Menu
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link text-light" href="#">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-light" href="#">
                    Following
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Desktop View */}
          <div className="collapse navbar-collapse d-none d-lg-flex">
            <a className="navbar-brand fw-bold text-light mx-3 ps-3" href="#">
              Spectra
            </a>

            {/* Search Bar (Only for Large Screens) */}
            <form className="d-flex mx-auto position-relative search-bar" style={{ width: "40%" }}>
              <span className="position-absolute start-0 top-50 translate-middle-y ps-3">
                <i className="bi bi-search fs-5 text-light"></i>
              </span>
              <input className="form-control ps-5 bg-dark text-light" type="search" placeholder="Search Quora" />
            </form>
            <ul className="navbar-nav align-items-center">
              <li className="nav-item mx-3 nav-hover">
                <a className="nav-link position-relative text-light" href="#" data-text="Home">
                  <i className="bi bi-house fs-4"></i>
                </a>
              </li>
              <li className="nav-item mx-3 nav-hover">
                {isLoggedIn ? (
                  <button type="button" className="btn btn-secondary" onClick={handleAccountClick}>
                    <Avatar alt="User Avatar" src={user?.avatar || "/static/images/avatar/1.jpg"} />
                  </button>
                ) : (
                  <button type="button" className="btn btn-secondary" onClick={handleAccountClick}>
                    <i className="bi bi-person fs-4"></i>
                  </button>
                )}
              </li>
              <li className="nav-item ms-4">
                <button className="btn btn-primary fw-bold" onClick={handleAddQuestionClick}>
                  + Add Question
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Search Bar for Mobile (Placed Below Navbar) */}
      <div className="container-fluid d-lg-none mt-2 px-3">
        <form className="d-flex position-relative search-bar">
          <span className="position-absolute start-0 top-50 translate-middle-y ps-3">
            <i className="bi bi-search fs-5 text-light"></i>
          </span>
          <input className="form-control ps-5 bg-dark text-light" type="search" placeholder="Search Quora" />
        </form>
      </div>

      {/* Floating Plus Icon for Mobile */}
      {isLoggedIn && (
        <div className="d-lg-none">
          <button
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              borderRadius: "50%",
              width: "60px",
              height: "60px",
              backgroundColor: "#007bff",
              border: "none",
              color: "white",
              fontSize: "24px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={handleAddQuestionClick}
          >
            <i className="bi bi-plus"></i>
          </button>
        </div>
      )}

      {/* Popper (Popover) for Account Options */}
      <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom-end">
        <ClickAwayListener onClickAway={handleClosePopper}>
          <Paper elevation={3} className="p-3">
            {isLoggedIn ? (
              <>
                <button className="btn btn-primary w-100" onClick={() => navigate("/profile")}>
                  Profile
                </button>
                <button className="btn btn-danger w-100 mt-2" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Typography variant="body1" className="fw-bold text-center" style={{ color: "black" }}>
                  Hello,{" "}
                  <a href="/login" id="signInLink" style={{ color: "blue", textDecoration: "none", fontWeight: "bold" }}>
                    Sign in
                  </a>
                </Typography>
                <Typography variant="body2" className="text-center mt-2">
                  New customer?{" "}
                  <a href="/register" id="registerLink" style={{ color: "blue", textDecoration: "none", fontWeight: "bold" }}>
                    Start here.
                  </a>
                </Typography>
              </>
            )}
          </Paper>
        </ClickAwayListener>
      </Popper>

      {/* Add Question Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom sx={{ color: "black" }}>
            Add a Question
          </Typography>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            margin="normal"
          />
          {/* Add this TextField for the answer */}
          <TextField
            fullWidth
            label="Answer"
            value={answerBody}
            onChange={(e) => setAnswerBody(e.target.value)}
            margin="normal"
            multiline
            rows={4}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={handleCloseModal} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmitQuestion}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Navbar;