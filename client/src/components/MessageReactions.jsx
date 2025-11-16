import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import "./MessageReactions.css";

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
    </div>
  );
};

export default MessageReactions;
