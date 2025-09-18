import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./BlogCard.css";

const BlogCard = ({
  id,
  title = "unknown",
  description = "not",
  imgUrl = ".",
  author = "undef",
}) => {
  return (
    <Link to={`/FullBlog/${id}`} className="blog-card-link">
      <div className="blog-card">
        <div className="blog-card-content">
          <h3 className="title">{title}</h3>
          <p className="desc">{description}</p>
          <small className="author">By {author}</small>
          {/* Read More Button */}
          <button className="read-more-btn">Read More</button>
        </div>
        {imgUrl && <img src={imgUrl} alt={title} className="blog-card-image" />}
      </div>
    </Link>
  );
};

BlogCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imgUrl: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
};

export default BlogCard;
