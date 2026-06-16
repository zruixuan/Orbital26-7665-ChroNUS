import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import {
  FiMail,
  FiLock,
  FiShield,
  FiEye,
  FiEyeOff
} from "react-icons/fi";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../api/firebase";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
const [modalType, setModalType] = useState("");
const [modalMessage, setModalMessage] = useState("");

  const handleRegister = async () => {
  if (!email || !password || !confirmPassword) {
    setModalType("error");
    setModalMessage("Please fill in all fields");
    setShowModal(true);
    return;
  }

  if (password !== confirmPassword) {
    setModalType("error");
    setModalMessage("Passwords do not match");
    setShowModal(true);
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);

    setModalType("success");
    setModalMessage("Your account has been created successfully.");
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
        <h1 className="login-title register-title">Create Account</h1>
        <p className="register-subtitle">
          Join us and start organizing your schedule better.
        </p>  
          <div className="register-form-card">
            <label className="register-label">Email</label>
            <div className="register-input-wrapper">
              <FiMail className="register-icon" />
              <input
                type="email"
                placeholder="Enter your email"
                className="login-input register-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

              <label className="register-label">Password</label>
              <div className="register-input-wrapper">
                <FiLock className="register-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  className="login-input register-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </div>
              </div>
    
              <label className="register-label">Confirm Password</label>
              <div className="register-input-wrapper">
                <FiLock className="register-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  className="login-input register-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </div>
              </div>

            <button
              className="login-button register-button"
              onClick={handleRegister}
            >
              Register
            </button>

            <p className="register-small-text">
              Already have an account? 
              <Link to="/">Login</Link>
            </p>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className={`modal-icon ${modalType}`}>
              {modalType === "success" ? "✓" : "!"}
            </div>

            <h3>
              {modalType === "success" ? "Register Successful" : "Register Failed"}
            </h3>

            <p>{modalMessage}</p>

            <button
              className="modal-button"
              onClick={() => {
                setShowModal(false);

                if (modalType === "success") {
                  navigate("/");
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

export default Register;