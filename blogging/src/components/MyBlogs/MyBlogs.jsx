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

const IMGBB_API_KEY = "6bbb7079ddf89b91d1130794534ab65e";

// BlogCard Component
function BlogCard({ blog, onUpdate, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const [imageFile, setImageFile] = useState(null);
  const cardRef = useRef(null);

  // ImgBB upload
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

  const handleUpdate = async () => {
    const updatedData = {
      title,
      content,
      imageUrl: imageFile ? await uploadToImgbb(imageFile) : blog.imageUrl,
    };
    await onUpdate(blog.id, updatedData);
    setEditing(false);
    setMenuOpen(false);
  };

  const handleDelete = async () => {
    // Animate fade out
    if (cardRef.current) {
      cardRef.current.style.opacity = 0;
      cardRef.current.style.transform = "scale(0.9)";
      setTimeout(() => onDelete(blog.id), 300); // remove after animation
    } else {
      onDelete(blog.id);
    }
  };

  return (
    <div className="blog-card" ref={cardRef}>
      {blog.imageUrl && <img src={blog.imageUrl} alt="Blog" />}
      <div className="blog-content">
        <div className="menu-dot" onClick={() => setMenuOpen(!menuOpen)}>
          ⋮
        </div>

        {menuOpen && (
          <div className="menu-dropdown">
            <div
              onClick={() => {
                setEditing(true);
                setMenuOpen(false);
              }}
            >
              Update
            </div>
            <div onClick={handleDelete}>Delete</div>
          </div>
        )}

        {editing ? (
          <div className="editing-section">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
            <button className="save-btn" onClick={handleUpdate}>
              Save
            </button>
            <button className="cancel-btn" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <>
            <h3>{title}</h3>
            <p>{content}</p>
          </>
        )}
      </div>
    </div>
  );
}

// Main MyBlogs Component
export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  // Ensure user is loaded
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch blogs for current user
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

  const updateBlog = async (id, updatedData) => {
    const blogRef = doc(db, "blogs", id);
    await updateDoc(blogRef, updatedData);
    setBlogs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedData } : b))
    );
  };

  const deleteBlog = async (id) => {
    await deleteDoc(doc(db, "blogs", id));
    setBlogs((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="myblogs-container">
      <h2>My Blogs</h2>
      <div className="blog-grid">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onUpdate={updateBlog}
              onDelete={deleteBlog}
            />
          ))
        ) : (
          <p>No blogs found.</p>
        )}
      </div>
    </div>
  );
}
