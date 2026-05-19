import { useState } from "react";
import { Link } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");//set the emial variable in order to let react know what users type in
  const [password, setPassword] = useState("");//set the password variable in order to let react know what users type in


  function handleLogin() {  //handle the case when one of them lost value
    if (email === "") {
      alert("Please enter your email");
      return;
    }

    if (password === "") {
      alert("Please enter your password");
      return;
    }

    console.log("Email:", email);
    console.log("Password:", password);
  }

  // to input email and password, and set the value to the state variable, and update the state variable when user type in
  // to check if the email and password are empty, if not, print the email and password to the console
  // turn to the reghister page
  // turn to the reset passoword page
  return (
    <div> 
      <h1>Login</h1>

      <label>Email</label> 
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <br />

      <label>Password</label> 
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <br />

      <button onClick={handleLogin}>Login</button> 

      <p>
        Don't have an account? <Link to="/register">Register</Link> 
      </p>

      <p>
        Forgot password? <Link to="/reset-password">Reset here</Link> 
      </p>
    </div>
  );
}

export default LoginPage;