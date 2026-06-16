import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/ForgotPassword.css";

import { FiMail } from "react-icons/fi";

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../api/firebase";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const handleReset = async () => {
    if (!email) {
      setModalType("error");
      setModalMessage("Please enter your email");
      setShowModal(true);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setModalType("success");
      setModalMessage("Password reset email sent. Please check your inbox.");
      setShowModal(true);
    } catch (error) {
      setModalType("error");
      setModalMessage(error.message);
      setShowModal(true);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title reset-title">Reset Password</h1>

        <p className="reset-subtitle">
          Enter your email and we will send you a password reset link.
        </p>

        <div className="reset-form-card">
          <label className="reset-label">Email</label>
          <div className="reset-input-wrapper">
            <FiMail className="reset-icon" />
            <input
              type="email"
              placeholder="Enter your email"
              className="login-input reset-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            className="login-button reset-button"
            onClick={handleReset}
          >
            Send Reset Email
          </button>

          <p className="reset-small-text">
            Remember your password?
            <Link to="/">Login</Link>
          </p>
        </div>
      </div>
            {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className={`modal-icon ${modalType}`}>
              {modalType === "success" ? "✅" : "❌"}
            </div>

            <h3>
              {modalType === "success" ? "Send Successful" : "Send Failed"}
            </h3>

            <p>{modalMessage}</p>

            <button
              className="modal-button"
              onClick={() => {
                setShowModal(false);

                if (modalType === "success") {
                  navigate("/dashboard");
                }
              }}
            >
              {modalType === "success" ? "Continue" : "Try Again"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default ForgotPassword;