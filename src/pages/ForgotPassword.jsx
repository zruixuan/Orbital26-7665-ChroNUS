import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  function handleReset() {
    alert("Reset link / code sent successfully!");
    navigate("/");
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Reset Password</h1>

        <input
          type="email"
          placeholder="Enter your email"
          className="login-input"
        />

        <button className="login-button" onClick={handleReset}>
          Send Reset Code
        </button>

        <p className="login-text">
          Remember your password?{" "}
          <Link to="/">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;