// src/components/Auth/SignupPage.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import Alerts from "../Alerts.jsx";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "./SignupPage.css";

const SignupPage = ({ onSignup }) => {
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const showAlert = (msg) => {
    setAlertMessage(null);
    setTimeout(() => setAlertMessage(msg), 50);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showAlert("Please enter your full name!");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        createdAt: new Date()
      });

      showAlert("Account created successfully!");
      onSignup();
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        showAlert("Email already in use!");
      } else if (error.code === "auth/invalid-email") {
        showAlert("Invalid email address!");
      } else if (error.code === "auth/weak-password") {
        showAlert("Password must be at least 6 characters!");
      } else {
        showAlert("Signup failed. Please try again.");
      }
    }
  };

  const handleGoogleSignup = async () => {
    if (!name.trim()) {
      showAlert("Please enter your full name before using Google signup!");
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Update display name if Google doesn't provide it
      if (!user.displayName) {
        await updateProfile(user, { displayName: name });
      }

      await setDoc(doc(db, "users", user.uid), {
        name,
        email: user.email,
        createdAt: new Date()
      });

      showAlert("Google signup successful!");
      onSignup();
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        showAlert("Email already in use!");
      } else if (error.code === "auth/invalid-email") {
        showAlert("Invalid email address!");
      } else {
        showAlert("Google signup failed. Try again.");
      }
    }
  };

  return (
    <div className="auth-card">
      <h2>Signup</h2>
      {alertMessage && <Alerts message={alertMessage} duration={4000} />}
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password (6+ chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="toggle-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </div>
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
