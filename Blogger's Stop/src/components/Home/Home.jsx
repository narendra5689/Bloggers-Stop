// src/components/Home/Home.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import "./Home.css";
import BlogCard from "../BlogCard.jsx";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch blogs from Firestore
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const blogList = querySnapshot.docs.map((doc) => ({
          id: doc.id, // IMPORTANT: keep this to pass to BlogCard
          ...doc.data(),
        }));

        setBlogs(blogList);
        setFilteredBlogs(blogList);
      } catch (error) {
        console.error("Error fetching blogs: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filter blogs based on debounced search term
  useEffect(() => {
    const results = blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(debouncedTerm.toLowerCase())
    );
    setFilteredBlogs(results);
  }, [debouncedTerm, blogs]);

  return (
    <div className="home">
      <input
        type="text"
        placeholder="Search blogs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      {loading ? (
        <p className="loading">Loading blogs...</p>
      ) : filteredBlogs.length > 0 ? (
        <div className="blog-list">
          {filteredBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id} // ← PASS the id here!
              title={blog.title}
              description={blog.content.substring(0, 100) + "..."}
              imgUrl={blog.imgUrl}
              author={blog.author}
            />
          ))}
        </div>
      ) : (
        <p>No blogs found.</p>
      )}
    </div>
  );
};

export default Home;
