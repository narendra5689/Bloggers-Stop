// src/components/SplashScreen/SplashScreen.jsx
import React from "react";
import "./SplashScreen.css";

const SplashScreen = () => {
  return (
    <div className="splash-container">
      {/* Floating background shapes */}
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>
      <div className="circle circle3"></div>

      {/* Content card */}
      <div className="splash-content">
        <h1 className="splash-title">
          {`Blogger's Stop`.split("").map((char, index) => (
            <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
              {char}
            </span>
          ))}
        </h1>
        <p className="splash-subtitle">
          Create, share, and explore blogs with ease ✨
        </p>
        <p className="splash-info">Please login or signup to continue.</p>
      </div>

      {/* Footer */}
      <footer className="splash-footer">
        © {new Date().getFullYear()} Blogger's Stop. All rights reserved.
      </footer>
    </div>
  );
};

export default SplashScreen;
