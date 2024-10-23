// import { useState } from "react";
import "./Chat.css";

// const Chat = ({ isActive }) => {
const Chat = ({ contact, isChannel = false, isActive = false }) => {
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

  return (
    <div
      // className="chat"
      className={`chat ${isActive ? "active-chat" : ""}`}
      // className={`chat ${activeChat === chatId ? "active-chat" : ""}`}
      // onClick={() => handleChatClick(chatId)}
    >
      {!isChannel && (
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
          <img src="./avatar.png" />
        </div>
      )}
      {isChannel && <div className="">#</div>}
      {isChannel ? (
        <span>{contact.name}</span>
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
            <div className="date">Date</div>
          </div>
          {/* <div className={`last-message ${isActive ? "active-chat" : ""}`}> */}
          <div className={`last-message ${isActive ? "active-chat" : ""}`}>
            Last Message
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
