import { useState } from "react";
import "./RequestChats.css";
import Chat from "../Chat";
import { useAppStore } from "../../../store";
import RequestChat from "../RequestChat";

const RequestChats = ({ contacts, isGroup = false }) => {
  //   const chatIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const {
    selectedChatData,
    setSelectedChatData,
    selectedChatType,
    setSelectedChatType,
    setSelectedChatMessages,
    activeChatId,
    setActiveChatId,
    // setSearchedContacts,
  } = useAppStore();

  const handleClick = (contact) => {
    setSelectedChatType(isGroup ? "group" : "contact");
    setSelectedChatData(contact);
    setActiveChatId(contact._id);
    // setSearchedContacts([]);

    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
      // setActiveChat(false);
    }
  };

  const [activeChat, setActiveChat] = useState(null);
  // const handleChatClick = (chatId) => {
  //   setActiveChat(chatId);
  // };

  return (
    <div className="request-chats">
      {contacts.map((contact) => (
        <div
          className="chat-outer-container"
          // key={contact.email}
          key={contact._id}
          // onClick={() => handleChatClick(id)}
          // onClick={() => handleClick(contact)}
          // className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
          //     selectedChatData && selectedChatData._id === contact._id
          //       ? "bg-[#8417ff] hover:bg-[#8417ff]"
          //       : "hover:bg-[#f1f1f111]"
          //   }`}
        >
          {/* {console.log(roles)} */}
          {/* {console.log("pendingExists: ", pendingExists)} */}
          {/* {console.log(pendingExists)} */}
          <RequestChat
            //   isActive={activeChat === id}
            contact={contact}
            isGroup={isGroup}
            // isActive={activeChat === contact._id}
            isActive={activeChatId === contact._id}
          />
        </div>
      ))}
    </div>
  );
};

export default RequestChats;
