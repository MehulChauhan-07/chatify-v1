import React from "react";

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
      <style jsx>{`
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          font-size: 14px;
          color: #666;
          font-style: italic;
        }

        .typing-text {
          flex-shrink: 0;
        }

        .typing-dots {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #666;
          animation: typing 1.4s infinite;
        }

        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%,
          60%,
          100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default TypingIndicator;
