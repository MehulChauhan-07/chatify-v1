// import { FaPlus } from "react-icons/fa6";
import { RiEmojiStickerLine } from "react-icons/ri";
// import { useEffect, useRef, useState } from "react";
// import { useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
// import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";

import "./SingleChatMessageBar.css";
import { useAppStore } from "../../../store";
import { useSocket } from "../../../context/SocketContext";
import upload from "../../../lib/upload";

const SingleChatMessageBar = () => {
  //   const emojiRef = useRef();

  //   const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const socket = useSocket();

  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setRefreshChatList,
    setActiveChatId,
  } = useAppStore();

  const [message, setMessage] = useState("");

  //   useEffect(() => {
  //     function handleClickOutside(event) {
  //       if (emojiRef.current && !emojiRef.current.contains(event.target)) {
  //         setEmojiPickerOpen(false);
  //       }
  //     }
  //     document.addEventListener("mousedown", handleClickOutside);
  //     return () => {
  //       document.removeEventListener("mousedown", handleClickOutside);
  //     };
  //   }, [emojiRef]);

  //   const handleAddEmoji = (emoji) => {
  //     setMessage((message) => message + emoji.emoji);
  //   };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // console.log(message);
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    }
    setActiveChatId(selectedChatData._id);
    setMessage("");
    setRefreshChatList(true);
    // window.location.reload();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // const [file, setFile] = useState({
  //   file: null,
  //   url: null,
  // });

  const fileInputRef = useRef();
  const handleFileAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileAttachmentChange = async (event) => {
    let fileUrl = null;

    try {
      const file = event.target.files[0];

      if (file) {
        fileUrl = await upload(file, selectedChatData._id);

        if (fileUrl) {
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: fileUrl,
            });
          } else if (selectedChatType === "channel") {
            socket.emit("sendChannelMessage", {
              sender: userInfo.id,
              content: undefined,
              messageType: "file",
              fileUrl: fileUrl,
              channelId: selectedChatData._id,
            });
          }
        }
      }
    } catch (error) {
      // setIsUploading(false);
      // setFileUploadProgress(0);
      console.log(error);
    }
  };

  return (
    <div className="message-bar">
      <div className="message-bar-icon currently-disabled-icon">
        {/* <div className="emoji-picker-icon" onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}> */}
        {/* <div className="emoji-picker-icon" ref={emojiRef}> */}
        <div className="emoji-picker-icon">
          <RiEmojiStickerLine
          // onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
          />
          {/* <div className="emoji-picker" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div> */}
        </div>
      </div>
      {/* <div className="message-bar-icon currently-disabled-icon">
        <GrAttachment />
      </div> */}
      <button className="message-bar-icon" onClick={handleFileAttachmentClick}>
        <GrAttachment />
      </button>
      <input
        type="file"
        className="attachment-hidden-input"
        ref={fileInputRef}
        onChange={handleFileAttachmentChange}
      />
      <div className="message-bar-searchbar">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="message-bar-search-input"
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="message-bar-icon" onClick={handleSendMessage}>
        <IoSend />
      </div>
    </div>
  );
};

export default SingleChatMessageBar;
