import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import icon from "../assets/icon.png";
import "@fontsource/quicksand";
import "../styles/Login.css";
import { loginApi } from "../api/authApi";

function LoginPage() {
  const [email, setEmail] = useState("");//set the emial variable in order to let react know what users type in
  const [password, setPassword] = useState("");//set the password variable in order to let react know what users type in
  const navigate = useNavigate();

  function handleLogin() {  //handle the case when one of them lost value
    if (email === "" || password === "") {
      alert("Please enter both email and password");
      return;
    }

    console.log("Email:", email);
    console.log("Password:", password);// Example: navigate to a dashboard page after successful login
    alert("Login successful! Navigating to dashboard...");
    navigate("/dashboard");
  }

  // to input email and password, and set the value to the state variable, and update the state variable when user type in
  // to check if the email and password are empty, if not, print the email and password to the console
  // turn to the reghister page
  // turn to the reset passoword page
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
      <input className="login-input"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

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