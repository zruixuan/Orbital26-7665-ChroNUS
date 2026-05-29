import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/ForgotPassword.css";

import { FiMail } from "react-icons/fi";

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../api/firebase";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent. Please check your inbox.");
    } catch (error) {
      alert(error.message);
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
    </div>
  );
}

export default ForgotPassword;