// src/components/Auth/SignupPage.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import "./SignupPage.css";

const SignupPage = ({ onSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Email/password signup
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onSignup(); // callback to update user state in App.jsx
    } catch (error) {
      alert(error.message);
    }
  };

  // Google OAuth signup/login
  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onSignup();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-card">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (6+ chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Signup</button>
      </form>

      <div className="oauth-section">
        <p>Or signup with:</p>
        <button className="google-btn" onClick={handleGoogleSignup}>
          Continue with Google
        </button>
      </div>
    </div>
  );
};

SignupPage.propTypes = {
  onSignup: PropTypes.func.isRequired,
};

export default SignupPage;
