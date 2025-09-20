// src/components/Auth/SignupPage.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import "./SignupPage.css";

const SignupPage = ({ onSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const actionCodeSettings = {
    url: window.location.href, // redirect back to current page after OTP click
    handleCodeInApp: true,
  };

  // Step 1: Send email link (OTP)
  const sendOtp = async () => {
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      setOtpSent(true);
      alert("OTP sent to your email! Check your inbox.");
    } catch (error) {
      console.error(error);
      alert("Failed to send OTP: " + error.message);
    }
  };

  // Step 2: Check if email link is valid and sign in
  React.useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let storedEmail = window.localStorage.getItem("emailForSignIn");
      if (!storedEmail) {
        storedEmail = window.prompt("Please enter your email for confirmation");
      }
      signInWithEmailLink(auth, storedEmail, window.location.href)
        .then(() => {
          window.localStorage.removeItem("emailForSignIn");
          setVerified(true);
          alert("OTP verified!");
        })
        .catch((err) => console.error(err));
    }
  }, []);

  // Step 3: Signup with password after OTP verification
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!verified) {
      alert("Please verify OTP via your email first.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onSignup();
    } catch (error) {
      alert(error.message);
    }
  };

  // Google OAuth
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

        {!otpSent ? (
          <button type="button" onClick={sendOtp} disabled={!email}>
            Send OTP
          </button>
        ) : (
          <p style={{ color: "green" }}>
            OTP sent! Check your email and click the link to verify.
          </p>
        )}

        <button type="submit" disabled={!verified}>
          Signup
        </button>
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
