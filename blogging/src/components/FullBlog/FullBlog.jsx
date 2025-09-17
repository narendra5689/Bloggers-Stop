// src/components/FullBlog/FullBlog.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import "./FullBlog.css";

const FullBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBlog(docSnap.data());
        } else {
          console.log("No such blog!");
        }
      } catch (error) {
        console.error("Error fetching blog: ", error);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) {
    return <p>Loading blog...</p>;
  }

  return (
    <div className="full-blog">
      <h1>{blog.title}</h1>
      <p>{blog.content}</p>
      <p>
        <strong>Author:</strong> {blog.author}
      </p>
      <p>
        <strong>Created at:</strong>{" "}
        {blog.createdAt?.toDate().toLocaleString() || "No date"}
      </p>
    </div>
  );
};

export default FullBlog;
