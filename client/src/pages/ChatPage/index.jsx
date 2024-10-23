// import { useState } from "react";
import { useEffect } from "react";
import ChatList from "../../components/ChatPageComponents/ChatList";
import LeftSidebar from "../../components/ChatPageComponents/LeftSidebar";
import SingleChat from "../../components/ChatPageComponents/SingleChat";
import { useAppStore } from "../../store";
import "./ChatPage.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const { userInfo, selectedChatType, selectedChatData } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast.error("Please set up your profile first");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  //   const [leftSidebarActiveIcon, setLeftSidebarActiveIcon] = useState(null);

  //   const notifyParentOfActiveIcon = (data) => {
  //     setLeftSidebarActiveIcon(data);
  //   };

  return (
    <div className="chat-page">
      {/* <LeftSidebar notifyParentOfActiveIcon={notifyParentOfActiveIcon} /> */}
      <LeftSidebar />
      {/* <ChatList leftSidebarActiveIcon={leftSidebarActiveIcon} /> */}
      <ChatList />
      <SingleChat />
    </div>
  );
};

export default ChatPage;
