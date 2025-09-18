// src/components/PublishBlog/PublishBlog.jsx
import React, { useState, useRef } from "react";
import { db, auth } from "../../firebase"; // Make sure auth is imported
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./PublishBlog.css";

const PublishBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);

  // Image upload function
  const funimgurl = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        "https://api.imgbb.com/1/upload?key=6bbb7079ddf89b91d1130794534ab65e",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      console.log("Image URL:", data.data.url);
      setImgUrl(data.data.url);
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imgUrl) {
      alert("Image is still uploading or not selected!");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("User not logged in!");
        return;
      }

      await addDoc(collection(db, "blogs"), {
        title,
        content,
        imgUrl,
        author,
        userId: user.uid, // <-- Store the current user's UID
        createdAt: serverTimestamp(),
      });

      alert("Blog published successfully ✅");

      // Reset form
      setTitle("");
      setContent("");
      setImgUrl("");
      setAuthor("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error adding blog: ", error);
      alert("Failed to publish blog. Try again.");
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
          ref={fileInputRef}
          className="file"
          type="file"
          onChange={funimgurl}
          required
        />
        {imgUrl && <img src={imgUrl} alt="Preview" className="preview-img" />}
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Publish"}
        </button>
      </form>
    </div>
  );
};

export default PublishBlog;
