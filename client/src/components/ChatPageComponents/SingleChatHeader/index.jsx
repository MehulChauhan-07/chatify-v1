import { IoMdMore } from "react-icons/io";
import { IoIosSearch } from "react-icons/io";
import "./SingleChatHeader.css";
import { useAppStore } from "../../../store";

const SingleChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType, setActiveIcon } =
    useAppStore();

  return (
    <div className="single-chat-header">
      <div className="user">
        <div className="avatar" onClick={() => setActiveIcon("avatar")}>
          <img src="./avatar.png" />
          {/* <div
                  className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedChatData.color
                  )}`}
                >
                  {selectedChatData.firstName
                    ? selectedChatData.firstName.split("").shift()
                    : selectedChatData.email.split("").shift()}
                </div> */}
        </div>
        <div className="info" onClick={() => setActiveIcon("avatar")}>
          <div>
            {selectedChatType === "contact" &&
              (selectedChatData.firstName && selectedChatData.lastName
                ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                : selectedChatData.firstName
                ? selectedChatData.firstName
                : selectedChatData.lastName
                ? selectedChatData.lastName
                : selectedChatData.email)}
          </div>
          <div>Last Seen</div>
        </div>
        <div></div>
      </div>
      <div className="icons">
        <div className="icon currently-disabled-icon">
          <IoIosSearch />
        </div>
        <div className="icon currently-disabled-icon">
          <IoMdMore />
        </div>
        {/* <div className="flex items-center justify-center gap-5">
          <button
            className="text-neutral-500 bg-[#1c1d25] focus:border-none focus:outline-none focus:text-white hover:border-none hover:outline-none duration-300 transition-all"
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default SingleChatHeader;
