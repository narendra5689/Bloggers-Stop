// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

// Components
import Home from "./components/Home/Home";
import PublishBlog from "./components/PublishBlog/PublishBlog";
import MyBlogs from "./components/MyBlogs/MyBlogs";
import FullBlog from "./components/FullBlog/FullBlog";
import LoginPage from "./components/LoginPage/LoginPage";
import SignupPage from "./components/SignupPage/SignupPage";
import SplashScreen from "./components/SplashScreen/SplashScreen";

// Styles
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNavbar, setShowNavbar] = useState(true);
  let lastScrollY = 0;

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Navbar hide/show on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false); // scroll down → hide navbar
      } else {
        setShowNavbar(true); // scroll up → show navbar
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <nav
        className="navbar"
        style={{ top: showNavbar ? "0" : "-80px", transition: "top 0.3s ease" }}
      >
        {user ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/PublishBlog">Create Blog</Link>
            <div className="dropdown">
              <span className="profile-link">Profile ▾</span>
              <div className="dropdown-content">
                <Link to="/MyBlogs">My Blogs</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </nav>

      <Routes>
        {user ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/PublishBlog" element={<PublishBlog />} />
            <Route path="/MyBlogs" element={<MyBlogs />} />
            <Route path="/FullBlog/:id" element={<FullBlog />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<SplashScreen />} />
            <Route
              path="/login"
              element={<LoginPage onLogin={() => setUser(auth.currentUser)} />}
            />
            <Route
              path="/signup"
              element={<SignupPage onSignup={() => setUser(auth.currentUser)} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
