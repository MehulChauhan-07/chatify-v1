import React from "react";
import "./TypingIndicator.css";

const TypingIndicator = ({ userName }) => {
  return (
    <div className="typing-indicator">
      <span className="typing-text">
        {userName ? `${userName} is typing` : "Someone is typing"}
      </span>
      <span className="typing-dots">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </span>
    </div>
  );
};

export default TypingIndicator;
