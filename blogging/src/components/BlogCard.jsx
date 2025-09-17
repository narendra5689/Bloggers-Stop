// src/components/BlogCard.jsx
import React from "react";
import PropTypes from "prop-types";
import "./BlogCard.css";

const BlogCard = ({ title="unknown", description="not", author="undef" }) => {
  return (
    <div className="blog-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <small>By {author}</small>
    </div>
  );
};

BlogCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
};

export default BlogCard;
