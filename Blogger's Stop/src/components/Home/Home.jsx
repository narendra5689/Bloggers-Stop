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

  // Utility function to normalize text
  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/gi, "") // remove quotes, punctuation, special chars
      .trim();
  };

  // Filter blogs based on debounced search term
  useEffect(() => {
    const normalizedTerm = normalizeText(debouncedTerm);

    const results = blogs.filter((blog) => {
      const title = normalizeText(blog.title || "");
      const content = normalizeText(blog.content || "");
      const author = normalizeText(blog.author || "");

      return (
        title.includes(normalizedTerm) ||
        content.includes(normalizedTerm) ||
        author.includes(normalizedTerm)
      );
    });

    setFilteredBlogs(results);
  }, [debouncedTerm, blogs]);

  let content;
  if (loading) {
    content = <p className="loading">Loading blogs...</p>;
  } else if (filteredBlogs.length > 0) {
    content = (
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
    );
  } else {
    content = <p>No blogs found.</p>;
  }

  return (
    <div className="home">
      <input
        type="text"
        placeholder="Search blogs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      {content}
    </div>
  );
};

export default Home;
