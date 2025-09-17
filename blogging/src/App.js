// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Home from "./components/Home/Home";
import PublishBlog from "./components/PublishBlog/PublishBlog";
import Profile from "./components/Profile/Profile";
import FullBlog from "./components/FullBlog/FullBlog";
import BlogCard from "./components/BlogCard";
import LoginPage from "./components/LoginPage/LoginPage";
import SignupPage from "./components/SignupPage/SignupPage";
import "./App.css";
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <BrowserRouter>
      <nav className="navbar">
        {user ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/PublishBlog">Create Blog</Link>

            <div className="dropdown">
              <span className="profile-link">Profile ▾</span>
              <div className="dropdown-content">
                <Link to="/Profile" className="MyBlog">My Blogs</Link>
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
        <Route path="/" element={<Home />} />
        <Route path="/BlogCard" element={<BlogCard />} />
        <Route path="/PublishBlog" element={<PublishBlog />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/FullBlog/:id" element={<FullBlog />} />
        <Route path="/login" element={<LoginPage onLogin={() => setUser(auth.currentUser)} />} />
        <Route path="/signup" element={<SignupPage onSignup={() => setUser(auth.currentUser)} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
