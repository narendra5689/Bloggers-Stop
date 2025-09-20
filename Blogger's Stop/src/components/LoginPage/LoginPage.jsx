// src/components/LoginPage/LoginPage.jsx
import React, { useState } from "react";
import { auth, provider } from "../../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import "./LoginPage.css";
import PropTypes from "prop-types";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Alerts from "../Alerts.jsx";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const showAlert = (msg) => {
    setAlertMessage(null);
    setTimeout(() => setAlertMessage(msg), 50);
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        showAlert("No user found with this email.");
      } else if (error.code === "auth/wrong-password") {
        showAlert("Incorrect password.");
      } else if (error.code === "auth/invalid-email") {
        showAlert("Invalid email address.");
      } else {
        showAlert("Login failed. Please try again.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      onLogin();
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        showAlert("Google login was cancelled.");
      } else {
        showAlert("Google login failed. Please try again.");
      }
    }
  };

  return (
    <div className="auth-card">
      <h2>Login</h2>
      {alertMessage && <Alerts message={alertMessage} duration={4000} />}
      <form onSubmit={handleEmailLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="password-toggle"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword(!showPassword)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setShowPassword(!showPassword);
              }
            }}
            tabIndex={0}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
        <button type="submit">Login</button>
      </form>
      <button className="google-btn" onClick={handleGoogleLogin}>
        Continue with Google
      </button>
    </div>
  );
};

LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginPage;
