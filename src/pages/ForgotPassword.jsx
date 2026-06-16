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

    setModalType("loading");
    setModalMessage("Sending password reset email...");
    setShowModal(true);

    try {
      await sendPasswordResetEmail(auth, email);

      setModalType("success");
      setModalMessage(
        "Password reset email sent. Please check your inbox."
      );
    } catch (error) {
      setModalType("error");
      setModalMessage(error.message);
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
              {modalType === "loading" ? (
                <span className="modal-spinner"></span>
              ) : modalType === "success" ? (
                "✅"
              ) : (
                "❌"
              )}
            </div>

            <h3>
              {modalType === "loading"
                ? "Sending Email"
                : modalType === "success"
                ? "Email Sent"
                : "Send Failed"}
            </h3>

            <p>{modalMessage}</p>

            {modalType !== "loading" && (
              <button
                className="modal-button"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                {modalType === "success" ? "Got It" : "Try Again"}
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default ForgotPassword;