// src/components/Alerts.jsx
import React, { useEffect, useState } from "react";
import "./Alerts.css";

const Alerts = ({ message, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`alert-popup ${visible ? "show" : "hide"}`}>
      {message}
    </div>
  );
};

export default Alerts;
