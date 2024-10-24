// import { useState } from "react";
import "./RequestChat.css";
import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import { apiClient } from "../../../lib/api-client";
import {
  ACCEPT_FRIEND_REQUEST_ROUTE,
  REJECT_FRIEND_REQUEST_ROUTE,
} from "../../../utils/constants";
import { useAppStore } from "../../../store";

// const Chat = ({ isActive }) => {
const RequestChat = ({ contact, isGroup = false, isActive = false }) => {
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

  const {
    userInfo,
    friendRequests,
    setFriendRequests,
    friendRequestsCount,
    setFriendRequestsCount,
  } = useAppStore();

  const handleAcceptRequest = async () => {
    try {
      const response = await apiClient.put(
        ACCEPT_FRIEND_REQUEST_ROUTE,
        {
          friendEmail: contact.email,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const newFriend = {
          email: response.data.newFriend.email,
          firstName: response.data.newFriend.firstName,
          lastName: response.data.newFriend.lastName,
          image: response.data.newFriend.image,
        };

        setFriendRequestsCount(friendRequests.length - 1);
        // setFriendRequestsCount((prevCount) => prevCount - 1);
        setFriendRequests(
          friendRequests.filter((request) => request.email !== newFriend.email)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejectRequest = async () => {
    try {
      const response = await apiClient.put(
        REJECT_FRIEND_REQUEST_ROUTE,
        {
          friendRequest: contact.email,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const deletedRequest = {
          email: response.data.deletedRequest.email,
          firstName: response.data.deletedRequest.firstName,
          lastName: response.data.deletedRequest.lastName,
          image: response.data.deletedRequest.image,
        };

        setFriendRequestsCount(friendRequests.length - 1);
        // setFriendRequestsCount((prevCount) => prevCount - 1);
        setFriendRequests(
          friendRequests.filter(
            (request) => request.email !== deletedRequest.email
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="request-chat"
      // className={`chat ${isActive ? "active-chat" : ""}`}
      // className={`chat ${activeChat === chatId ? "active-chat" : ""}`}
      // onClick={() => handleChatClick(chatId)}
    >
      {/* <div className="outer-container"> */}
      <div className="container">
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
        {isGroup && <div className="">#</div>}
        {isGroup ? (
          <span>{contact.name}</span>
        ) : (
          <>
            <div className="inner-container">
              <div className="inner-most-container">
                {/* <div className="container"> */}
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
                    {/* <div className="date">Date</div> */}
                  </div>
                  {/* <div className={`last-message ${isActive ? "active-chat" : ""}`}> */}
                  {/* <div className={`last-message ${isActive ? "active-chat" : ""}`}>
                    Last Message
                  </div> */}
                  <div className={`last ${isActive ? "active-chat" : ""}`}>
                    Pending your approval
                  </div>
                  {/* <div className="last-message">Last Message</div> */}
                </div>

                <div className="request-chat-icons">
                  {/* <div className="container"> */}
                  <div className="icon reject" onClick={handleRejectRequest}>
                    <IoIosClose />
                  </div>
                  <div className="icon approve" onClick={handleAcceptRequest}>
                    <TiTick />
                  </div>
                  {/* </div> */}
                </div>

                {/* </div> */}
              </div>

              <div className="last-message"></div>
            </div>
          </>
        )}
      </div>
      {/* </div> */}

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

export default RequestChat;
