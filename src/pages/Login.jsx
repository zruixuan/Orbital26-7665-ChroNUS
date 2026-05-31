import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import icon from "../assets/icon.png";
import "@fontsource/quicksand";
import "../styles/Login.css";
import {
  FiMail,
  FiLock,
  FiShield,
  FiEye,
  FiEyeOff
} from "react-icons/fi";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../api/firebase";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    if (email === "" || password === "") {
      alert("Please enter both email and password");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);

      alert("Login successful! Navigating to dashboard...");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="login-container"> 
      <img src={icon} alt="ChroNUS Icon" className="logo" />

      <h1 className="login-title">ChroNUS</h1>

      <label>Email</label> 
      <input className="login-input"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <br />

      <label>Password</label>

      <div className="password-wrapper">
        <input
          className="login-input"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button
          type="button"
          className="eye-button"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>

      <br />

      <button className="login-button" onClick={handleLogin}>
        Login
      </button>

      <p className="bottom-text">
        Don't have an account? <Link to="/register">Register</Link> 
      </p>

      <p className="bottom-text">
        Forgot password? <Link to="/forgot-password">Reset here</Link> 
      </p>
    </div>
  );
}

export default LoginPage;