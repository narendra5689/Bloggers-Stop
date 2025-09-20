import React, { useState, useRef } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./PublishBlog.css";

const PublishBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [popupMessage, setPopupMessage] = useState(""); // <-- for popup messages

  const fileInputRef = useRef(null);

  const showPopup = (msg) => {
    setPopupMessage(msg);
    setTimeout(() => setPopupMessage(""), 3000); // hide after 3s
  };

  const funimgurl = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      showPopup("Please select a file first!");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        "https://api.imgbb.com/1/upload?key=6bbb7079ddf89b91d1130794534ab65e",
        { method: "POST", body: formData }
      );

      const data = await res.json();
      setImgUrl(data.data.url);
      showPopup("Image uploaded successfully ✅");
    } catch (err) {
      console.error("Image upload failed:", err);
      showPopup("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imgUrl) {
      
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        showPopup("User not logged in!");
        return;
      }

      await addDoc(collection(db, "blogs"), {
        title,
        content,
        imgUrl,
        author,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      showPopup("Blog published successfully ✅");

      // Reset form
      setTitle("");
      setContent("");
      setImgUrl("");
      setAuthor("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error adding blog: ", error);
      showPopup("Failed to publish blog. Try again.");
    }
  };

  return (
    <div className="publish-blog">
      {popupMessage && <div className="popup-message">{popupMessage}</div>}
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
