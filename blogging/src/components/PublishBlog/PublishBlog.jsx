// src/components/PublishBlog/PublishBlog.jsx
import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./PublishBlog.css";

const PublishBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "blogs"), {
        title,
        content,
        author,
        createdAt: serverTimestamp(),
      });

      alert("Blog published successfully ✅");
      setTitle("");
      setContent("");
      setAuthor("");
    } catch (error) {
      console.error("Error adding blog: ", error);
    }
  };

  return (
    <div className="publish-blog">
      <h1>Publish Blog</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Write your blog here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <button type="submit">Publish</button>
      </form>
    </div>
  );
};

export default PublishBlog;
