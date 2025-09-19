import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./Alerts.css";

const Alerts = ({ message, duration = 3000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return <div className="alert">{message}</div>;
};

Alerts.propTypes = {
  message: PropTypes.string.isRequired,
  duration: PropTypes.number, // in ms
};

export default Alerts;   // ✅ make sure this line exists
