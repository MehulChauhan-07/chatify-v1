import { useEffect } from "react";
import ChatList from "../../components/ChatPageComponents/ChatList";
import LeftSidebar from "../../components/ChatPageComponents/LeftSidebar";
import SingleChat from "../../components/ChatPageComponents/SingleChat";
import { useAppStore } from "../../store";
import "./ChatPage.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast.error("Please set up your profile first");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="chat-page">
      <LeftSidebar />
      <ChatList />
      <SingleChat />
    </div>
  );
};

export default ChatPage;
