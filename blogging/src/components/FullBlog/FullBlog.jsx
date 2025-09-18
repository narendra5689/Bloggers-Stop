// src/components/FullBlog/FullBlog.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import "./FullBlog.css";

const FullBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    // Update auth state
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    // Fetch blog
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBlog({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such blog!");
        }
      } catch (error) {
        console.error("Error fetching blog: ", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch comments
    const fetchComments = async () => {
      try {
        const commentsRef = collection(db, "blogs", id, "comments");
        const querySnapshot = await getDocs(commentsRef);
        const commentsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          showMenu: false,
        }));
        // Sort comments by createdAt descending
        commentsList.sort(
          (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
        );
        setComments(commentsList);
      } catch (error) {
        console.error("Error fetching comments: ", error);
      }
    };

    fetchBlog();
    fetchComments();

    return () => unsubscribe();
  }, [id]);

  // Like toggle
  const handleLike = async () => {
    if (!user) return alert("You must log in to like!");
    try {
      const blogRef = doc(db, "blogs", id);
      const userLikes = blog.likedBy || [];
      let updatedLikes, updatedLikedBy;

      if (userLikes.includes(user.uid)) {
        // Unlike
        updatedLikes = (blog.likes || 1) - 1;
        updatedLikedBy = userLikes.filter((uid) => uid !== user.uid);
      } else {
        // Like
        updatedLikes = (blog.likes || 0) + 1;
        updatedLikedBy = [...userLikes, user.uid];
      }

      await updateDoc(blogRef, { likes: updatedLikes, likedBy: updatedLikedBy });
      setBlog((prev) => ({ ...prev, likes: updatedLikes, likedBy: updatedLikedBy }));
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  // Add comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must log in to comment!");
    if (!newComment.trim()) return;

    try {
      const commentsRef = collection(db, "blogs", id, "comments");
      const docRef = await addDoc(commentsRef, {
        text: newComment,
        createdAt: serverTimestamp(),
        userId: user.uid,
      });

      setComments((prev) => [
        { id: docRef.id, text: newComment, userId: user.uid, createdAt: { toDate: () => new Date() }, showMenu: false },
        ...prev,
      ]);

      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Toggle comment menu
  const toggleMenu = (commentId) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, showMenu: !c.showMenu } : { ...c, showMenu: false }
      )
    );
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteDoc(doc(db, "blogs", id, "comments", commentId));
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Edit comment
  const handleEditComment = async (commentId) => {
    const commentToEdit = comments.find((c) => c.id === commentId);
    const newText = prompt("Edit your comment:", commentToEdit.text);
    if (!newText) return;

    try {
      await updateDoc(doc(db, "blogs", id, "comments", commentId), { text: newText });
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, text: newText } : c))
      );
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  if (loading) return <p>Loading blog...</p>;
  if (!blog) return <p>Blog not found.</p>;

  return (
    <div className="full-blog">
      <h1>{blog.title}</h1>
      {blog.imgUrl && <img src={blog.imgUrl} alt={blog.title} className="blog-image" />}
      <p>{blog.content}</p>
      <p><strong>Author:</strong> {blog.author}</p>
      <p><strong>Created at:</strong> {blog.createdAt?.toDate().toLocaleString() || "No date"}</p>

      {/* Likes */}
      <div className="likes-section">
        <button onClick={handleLike} className="like-btn">
          {user && blog.likedBy?.includes(user.uid) ? "💔 Unlike" : "👍 Like"}
        </button>
        <span>{blog.likes || 0} Likes</span>
      </div>

      <hr />

      {/* Comments */}
      <div className="comments-section">
        <h3>Comments</h3>
        <form onSubmit={handleAddComment} className="comment-form">
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit">Post</button>
        </form>

        {comments.length > 0 ? (
          <ul className="comment-list">
            {comments.map((comment) => (
              <li key={comment.id} className="comment">
                <p>{comment.text}</p>
                <small>
                  {comment.createdAt?.toDate
                    ? comment.createdAt.toDate().toLocaleString()
                    : "Just now"}
                </small>

                {user?.uid === comment.userId && (
                  <div className="comment-actions">
                    <button
                      type="button"
                      className="dots"
                      onClick={() => toggleMenu(comment.id)}
                    >
                      ⋮
                    </button>
                    {comment.showMenu && (
                      <div className="menu-popup">
                        <button onClick={() => handleEditComment(comment.id)}>Edit</button>
                        <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet. Be the first!</p>
        )}
      </div>
    </div>
  );
};

export default FullBlog;
