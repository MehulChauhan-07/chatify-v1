import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";

const MessageReactions = ({ reactions = [], onAddReaction, currentUserId }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Group reactions by emoji
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = {
        emoji: reaction.emoji,
        count: 0,
        users: [],
        hasCurrentUser: false,
      };
    }
    acc[reaction.emoji].count++;
    acc[reaction.emoji].users.push(reaction.user);
    if (reaction.user._id === currentUserId || reaction.user === currentUserId) {
      acc[reaction.emoji].hasCurrentUser = true;
    }
    return acc;
  }, {});

  const handleEmojiClick = (emojiData) => {
    onAddReaction(emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="message-reactions">
      {Object.values(groupedReactions).map((reaction) => (
        <button
          key={reaction.emoji}
          className={`reaction-btn ${reaction.hasCurrentUser ? "active" : ""}`}
          onClick={() => onAddReaction(reaction.emoji)}
          title={`${reaction.count} reaction${reaction.count > 1 ? "s" : ""}`}
        >
          <span className="reaction-emoji">{reaction.emoji}</span>
          <span className="reaction-count">{reaction.count}</span>
        </button>
      ))}
      <button
        className="add-reaction-btn"
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        title="Add reaction"
      >
        +
      </button>
      {showEmojiPicker && (
        <div className="emoji-picker-container">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
      <style jsx>{`
        .message-reactions {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 4px;
          position: relative;
        }

        .reaction-btn,
        .add-reaction-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .reaction-btn:hover,
        .add-reaction-btn:hover {
          background: #f5f5f5;
          border-color: #d0d0d0;
        }

        .reaction-btn.active {
          background: #e3f2fd;
          border-color: #2196f3;
        }

        .reaction-emoji {
          font-size: 16px;
        }

        .reaction-count {
          font-size: 12px;
          color: #666;
        }

        .add-reaction-btn {
          color: #666;
          font-size: 16px;
          padding: 2px 10px;
        }

        .emoji-picker-container {
          position: absolute;
          bottom: 100%;
          left: 0;
          z-index: 1000;
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
};

export default MessageReactions;
