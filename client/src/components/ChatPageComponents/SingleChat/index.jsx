import { BsFillTriangleFill } from "react-icons/bs";
import { useAppStore } from "../../../store";
import SingleChatHeader from "../SingleChatHeader";
import SingleChatMessageBar from "../SingleChatMessageBar";
import SingleChatMessageContainer from "../SingleChatMessageContainer";
import "./SingleChat.css";

const SingleChat = () => {
  const { userInfo, selectedChatType, selectedChatData } = useAppStore();

  // const chat = true;

  return (
    <div className="single-chat">
      {selectedChatType ? (
        <>
          <SingleChatHeader />
          {/* <div className="filler-container">
            <div className="horizontal-filler"></div>
            <div className="scrollbar-triangle">
              <BsFillTriangleFill />
            </div>
          </div> */}
          <SingleChatMessageContainer />
          {/* <div className="filler-container">
            <div className="horizontal-filler"></div>
            <div className="scrollbar-triangle-upside-down">
              <BsFillTriangleFill />
            </div>
          </div> */}
          <SingleChatMessageBar />
        </>
      ) : null}
    </div>
  );
};

export default SingleChat;
