// import { useState } from "react";
import "./Chat.css";
import { MdGroups } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi";
import { MdFolderZip } from "react-icons/md";

import moment from "moment";

// const Chat = ({ isActive }) => {
const Chat = ({ contact, isGroup = false, isActive = false }) => {
  // const [activeChat, setActiveChat] = useState(null);
  // const handleChatClick = (chatId) => {
  //   setActiveChat(chatId);
  //   // if (filterName == undefined || filterName == null) {
  //   //   setActiveFilter(null);
  //   // } else {
  //   //   setActiveFilter(filterName);
  //   // }
  // };

  // console.log("contact: " + contact.name);

  // const contactLastChatMessage = contact.messages[contact.messages.length - 1];

  const getFileExtensionFromUrl = (url) => {
    if (!url) return ""; // Handle cases where the URL is undefined or null

    // Remove query parameters if they exist
    const pathWithoutParams = url.split("?")[0];

    // Get the file name part (last part after "/")
    const fileName = pathWithoutParams.split("/").pop();

    // Extract the extension (part after the last ".")
    const extension = fileName.includes(".") ? fileName.split(".").pop() : "";

    return `${extension} file`;
  };

  return (
    <div
      // className="chat"
      className={`chat ${isActive ? "active-chat" : ""}`}
      // className={`chat ${activeChat === chatId ? "active-chat" : ""}`}
      // onClick={() => handleChatClick(chatId)}
    >
      {/* {console.log("contact:")}
      {console.log(contact)} */}
      {!isGroup && (
        //   <Avatar className="w-10 h-10 rounded-full overflow-hidden">
        //     {contact.image ? (
        //       <AvatarImage
        //         src={`${HOST}/${contact.image}`}
        //         alt="profile"
        //         className="object-cover w-full h-full bg-black"
        //       />
        //     ) : (
        //       <div
        //         className={`
        //             ${
        //               selectedChatData &&
        //               selectedChatData._id === contact._id
        //                 ? "bg-[#ffffff22] border border-white/70"
        //                 : getColor(contact.color)
        //             }
        //             uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full`}
        //       >
        //         {contact.firstName
        //           ? contact.firstName.split("").shift()
        //           : contact.email.split("").shift()}
        //       </div>
        //     )}
        //   </Avatar>
        <div className="chat-header-info-avatar">
          {/* <img src="./avatar.png" /> */}
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
          {/* <div className="group-img">#</div> */}
          {/* <div className="group-img"><MdGroups /></div> */}
          <div className="group-img">
            <HiUserGroup />
          </div>
          {/* # */}
        </div>
      )}
      {/* {console.log("contact:")}
      {console.log(contact)} */}
      {isGroup ? (
        <div className="chat-info">
          <div className="chat-info-head">
            {contact.name}
            <div className="date">
              {/* Date */}
              {/* {contact.lastMessage?.timestamp} */}
              {contact.lastMessage?.timestamp &&
                moment(contact.lastMessage?.timestamp).format("LT")}
            </div>
          </div>
          <div className={`last-message ${isActive ? "active-chat" : ""}`}>
            {/* Last Message */}
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

            {/* <div>{`${contact.firstName} ${contact.lastName}`}</div> */}
            <div className="date">
              {/* Date */}
              {/* {contact.lastMessageTime} */}
              {contact.lastMessageTime &&
                moment(contact.lastMessageTime).format("LT")}
            </div>
          </div>
          {/* <div className={`last-message ${isActive ? "active-chat" : ""}`}> */}
          <div className={`last-message ${isActive ? "active-chat" : ""}`}>
            {/* Last Message */}
            {contact.lastMessageType === "file" && (
              <MdFolderZip className="last-message-file" />
            )}
            {contact.lastMessageType === "text"
              ? contact.lastMessage
              : `${getFileExtensionFromUrl(contact.lastMessage)}`}
          </div>
          {/* <div className="last-message">Last Message</div> */}
        </div>
      )}

      {/* <div className="chat-header-info-avatar">
        <img src="./avatar.png" />
      </div> */}
      {/* <div className="chat-info">
        <div className="chat-info-head">
          <div>Name</div>
          <div className="date">Date</div>
        </div> */}
      {/* <div className={`last-message ${isActive ? "active-chat" : ""}`}> */}
      {/* <div className="last-message">
          Last Message
        </div> */}
      {/* </div> */}
    </div>
  );
};

export default Chat;
