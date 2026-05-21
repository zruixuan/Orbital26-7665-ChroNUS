import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ForgotPassword.css";

import {
  FiMail,
  FiLock,
  FiShield,
  FiEye,
  FiEyeOff
} from "react-icons/fi";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleReset = () => {
    if (!email || !code || !newPassword) {
      alert("Please fill in all fields");
      return;
    }

    alert("Password reset successful");
    navigate("/");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title reset-title">Reset Password</h1>

        <p className="reset-subtitle">
          Enter your email and create a new password.
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

          <label className="reset-label">Verification Code</label>
          <div className="reset-code-row">
            <div className="reset-code-input-wrapper">
              <FiShield className="reset-icon" />
              <input
                type="text"
                placeholder="Verification code"
                className="reset-code-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <button className="reset-code-button">
              Send Code
            </button>
          </div>

          <label className="reset-label">New Password</label>
          <div className="reset-input-wrapper">
            <FiLock className="reset-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create new password"
              className="login-input reset-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <div
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </div>
          </div>

          <button
            className="login-button reset-button"
            onClick={handleReset}
          >
            Reset Password
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