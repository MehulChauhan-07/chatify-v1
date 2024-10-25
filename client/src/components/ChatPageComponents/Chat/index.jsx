import "./Chat.css";
import { HiUserGroup } from "react-icons/hi";
import { MdFolderZip } from "react-icons/md";

import moment from "moment";

const Chat = ({ contact, isGroup = false, isActive = false }) => {
  const getFileExtensionFromUrl = (url) => {
    if (!url) return "";

    // Remove query parameters if they exist
    const pathWithoutParams = url.split("?")[0];

    // Get the file name part (last part after "/")
    const fileName = pathWithoutParams.split("/").pop();

    // Extract the extension (part after the last ".")
    const extension = fileName.includes(".") ? fileName.split(".").pop() : "";

    return `${extension} file`;
  };

  return (
    <div className={`chat ${isActive ? "active-chat" : ""}`}>
      {!isGroup && (
        <div className="chat-header-info-avatar">
          <div className="img">
            {contact.firstName && contact.lastName
              ? `${contact.firstName.charAt(0)} ${contact.lastName.charAt(0)}`
              : contact.firstName
              ? contact.firstName.charAt(0)
              : contact.lastName
              ? contact.lastName.charAt(0)
              : contact.email.charAt(0)}
          </div>
        </div>
      )}
      {isGroup && (
        <div className="chat-header-info-avatar">
          <div className="group-img">
            <HiUserGroup />
          </div>
        </div>
      )}
      {isGroup ? (
        <div className="chat-info">
          <div className="chat-info-head">
            {contact.name}
            <div className="date">
              {contact.lastMessage?.timestamp &&
                moment(contact.lastMessage?.timestamp).format("LT")}
            </div>
          </div>
          <div className={`last-message ${isActive ? "active-chat" : ""}`}>
            {contact.lastMessage?.messageType === "file" && (
              <MdFolderZip className="last-message-file" />
            )}
            {contact.lastMessage?.messageType === "text"
              ? contact.lastMessage?.content
              : `${getFileExtensionFromUrl(contact.lastMessage?.fileUrl)}`}
          </div>
        </div>
      ) : (
        <div className="chat-info">
          <div className="chat-info-head">
            {contact.firstName && contact.lastName
              ? `${contact.firstName} ${contact.lastName}`
              : contact.firstName
              ? contact.firstName
              : contact.lastName
              ? contact.lastName
              : contact.email}

            <div className="date">
              {contact.lastMessageTime &&
                moment(contact.lastMessageTime).format("LT")}
            </div>
          </div>
          <div className={`last-message ${isActive ? "active-chat" : ""}`}>
            {contact.lastMessageType === "file" && (
              <MdFolderZip className="last-message-file" />
            )}
            {contact.lastMessageType === "text"
              ? contact.lastMessage
              : `${getFileExtensionFromUrl(contact.lastMessage)}`}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
