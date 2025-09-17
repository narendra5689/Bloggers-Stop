// src/components/Home/Home.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import "./Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const blogList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setBlogs(blogList);
      } catch (error) {
        console.error("Error fetching blogs: ", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="home">
      <h1>Latest Blogs</h1>
      <div className="blog-list">
        {blogs.length > 0 ? (
  blogs.map((blog) => (
    <div key={blog.id} className="blog-card">
      <h2>{blog.title}</h2>
      <p>{blog.content.substring(0, 150)}...</p>
      <p className="author">By {blog.author}</p>
      <p className="date">
        {blog.createdAt?.toDate().toLocaleString() || "No date"}
      </p>
      <Link to={`/FullBlog/${blog.id}`}>
        <button className="show-full-blog-btn">Read More</button>
      </Link>
    </div>
  ))
) : (
  <p>No blogs found.</p>
)}

      </div>
    </div>
  );
};

export default Home;
