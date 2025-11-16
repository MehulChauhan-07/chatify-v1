import React, { useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";

const EmojiPickerComponent = ({ onEmojiClick, isOpen, onClose }) => {
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={pickerRef}
      style={{
        position: "absolute",
        bottom: "60px",
        right: "20px",
        zIndex: 1000,
      }}
    >
      <EmojiPicker onEmojiClick={onEmojiClick} />
    </div>
  );
};

export default EmojiPickerComponent;
