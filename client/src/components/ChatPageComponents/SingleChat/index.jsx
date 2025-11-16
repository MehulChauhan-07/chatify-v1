import { useAppStore } from "../../../store";
import { useAuth } from "../../../hooks/useAuth";
import SingleChatHeader from "../SingleChatHeader";
import SingleChatMessageBar from "../SingleChatMessageBar";
import SingleChatMessageContainer from "../SingleChatMessageContainer";
import ResetApp from "../ResetApp";
import "./SingleChat.css";

const SingleChat = () => {
  const { selectedChatType } = useAppStore();
  const { user: userInfo } = useAuth();

  return (
    <div className="single-chat">
      {selectedChatType ? (
        <>
          <SingleChatHeader />
          <SingleChatMessageContainer />
          <SingleChatMessageBar />
        </>
      ) : userInfo?.isAdmin ? (
        <ResetApp />
      ) : null}
    </div>
  );
};

export default SingleChat;
