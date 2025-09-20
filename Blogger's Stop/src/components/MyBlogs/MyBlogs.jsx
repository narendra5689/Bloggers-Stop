// src/components/MyBlogs/MyBlogs.jsx
import React, { useEffect, useState, useRef } from "react";
import { auth, db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import "./MyBlogs.css";
import Alerts from "../Alerts.jsx"; // Make sure this path is correct

const IMGBB_API_KEY = "6bbb7079ddf89b91d1130794534ab65e";

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  // Listen for user auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch user blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      if (!user) return;
      const q = query(
        collection(db, "blogs"),
        where("userId", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBlogs(data);
    };
    fetchBlogs();
  }, [user]);

  // Upload image to imgbb
  const uploadToImgbb = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    return data.data.url;
  };

  // Update blog in Firebase
  const updateBlog = async (id, updatedData) => {
    const blogRef = doc(db, "blogs", id);
    await updateDoc(blogRef, updatedData);
    setBlogs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedData } : b))
    );
    setAlertMessage("Blog edited successfully!"); // ✅ show popup
  };

  // Delete blog
  const deleteBlog = async (id) => {
    await deleteDoc(doc(db, "blogs", id));
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    setAlertMessage("Blog deleted successfully!"); // ✅ show popup
  };

  // Single blog card
  const BlogCard = ({ blog }) => {
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(blog.title || "");
    const [description, setDescription] = useState(blog.description || "");
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(blog.imgUrl);
    const cardRef = useRef(null);

    const handleUpdate = async () => {
      let imageUrl = blog.imgUrl;
      if (imageFile) {
        imageUrl = await uploadToImgbb(imageFile);
      }

      const updatedData = {
        title: title || blog.title,
        description: description || blog.description || "",
        imgUrl: imageUrl,
        author: blog.author || "Unknown",
      };

      await updateBlog(blog.id, updatedData);
      setPreviewImage(imageUrl);
      setEditing(false);
    };

    const handleDelete = async () => {
      if (cardRef.current) {
        cardRef.current.style.opacity = 0;
        cardRef.current.style.transform = "scale(0.9)";
        setTimeout(() => deleteBlog(blog.id), 300);
      } else {
        deleteBlog(blog.id);
      }
    };

    return (
      <div className="blog-card" ref={cardRef}>
        {editing ? (
          <div className="editing-section">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setImageFile(file);
                setPreviewImage(file ? URL.createObjectURL(file) : blog.imgUrl);
              }}
            />
            <div className="btn-row">
              <button onClick={handleUpdate}>Save</button>
              <button
                onClick={() => {
                  setEditing(false);
                  setTitle(blog.title || "");
                  setDescription(blog.description || "");
                  setPreviewImage(blog.imgUrl);
                  setImageFile(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="blog-card-content">
              <h3 className="title">{title}</h3>
              <p className="desc">{description}</p>
              <small className="author">By {blog.author || "Unknown"}</small>
            </div>
            {previewImage && (
              <img src={previewImage} alt={title} className="blog-card-image" />
            )}
            <div className="blog-actions">
              <button onClick={() => setEditing(true)}>✏️ Update</button>
              <button onClick={handleDelete}>🗑️ Delete</button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="myblogs-container">
      <h2>My Blogs</h2>
      {alertMessage && <Alerts message={alertMessage} duration={3000} />}
      <div className="blog-grid">
        {blogs.length > 0 ? (
          blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)
        ) : (
          <p>No blogs found.</p>
        )}
      </div>
    </div>
  );
}
