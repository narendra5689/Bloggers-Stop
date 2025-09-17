// src/AuthContext.jsx
import { useEffect } from "react";
import { auth } from "./firebase";
import { setPersistence, browserLocalPersistence } from "firebase/auth";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

// Import your components
import Home from "./components/Home";
import BlogCard from "./components/BlogCard";
import PublishBlog from "./components/PublishBlog/PublishBlog";
import Profile from "./components/Profile";
import FullBlog from "./components/FullBlog";

function AuthContext() {
  useEffect(() => {
    const setAuthPersistence = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
        console.log("Auth persistence set ✅");
      } catch (error) {
        console.error("Error setting persistence:", error);
      }
    };
    setAuthPersistence();
  }, []);

  return (
    <Router>
      <div>
        <nav className="navbar">
          <Link to="/PublishBlog">Write Blog</Link>
          <Link to="/">Home</Link>
          <Link to="/Profile">Profile</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/BlogCard" element={<BlogCard />} />
          <Route path="/PublishBlog" element={<PublishBlog />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/FullBlog/:id" element={<FullBlog />} />
        </Routes>
      </div>
    </Router>
  );
}

export default AuthContext;
