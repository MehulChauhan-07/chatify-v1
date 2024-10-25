import { useAppStore } from "../../../store";
import SingleChatHeader from "../SingleChatHeader";
import SingleChatMessageBar from "../SingleChatMessageBar";
import SingleChatMessageContainer from "../SingleChatMessageContainer";
import "./SingleChat.css";

const SingleChat = () => {
  const { selectedChatType } = useAppStore();

  return (
    <div className="single-chat">
      {selectedChatType ? (
        <>
          <SingleChatHeader />
          <SingleChatMessageContainer />
          <SingleChatMessageBar />
        </>
      ) : null}
    </div>
  );
};

export default SingleChat;
