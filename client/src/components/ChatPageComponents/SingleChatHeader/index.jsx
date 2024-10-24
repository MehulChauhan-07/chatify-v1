import { IoMdMore } from "react-icons/io";
import { IoIosSearch } from "react-icons/io";
import "./SingleChatHeader.css";
import { useAppStore } from "../../../store";
import { GET_GROUP_MEMBERS_ROUTE } from "../../../utils/constants";
import { useEffect } from "react";
import { apiClient } from "../../../lib/api-client";

const SingleChatHeader = () => {
  const {
    closeChat,
    selectedChatData,
    selectedChatType,
    setActiveIcon,
    selectedChatMembers,
    setSelectedChatMembers,
    userInfo,
  } = useAppStore();

  useEffect(() => {
    const getGroupMembers = async () => {
      try {
        const response = await apiClient.get(
          `${GET_GROUP_MEMBERS_ROUTE}/${selectedChatData._id}`,
          // { members: selectedChatData.members },
          { withCredentials: true }
        );

        if (response.data.members) {
          setSelectedChatMembers(response.data.members);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (selectedChatData._id) {
      if (selectedChatType === "group") {
        getGroupMembers();
      }
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMembers]);

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
            {selectedChatType === "group" && selectedChatData.name}
            {selectedChatType === "contact" &&
              (selectedChatData.firstName && selectedChatData.lastName
                ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                : selectedChatData.firstName
                ? selectedChatData.firstName
                : selectedChatData.lastName
                ? selectedChatData.lastName
                : selectedChatData.email)}
          </div>
          {selectedChatType === "group" ? (
            <div className="group-members">
              {/* {console.log("userInfo:")}
              {console.log(userInfo)} */}
              {selectedChatMembers.map((member, index) => (
                <span key={member.id} className="member">
                  {/* {member.firstName} {member.lastName} */}
                  {member.id === userInfo.id
                    ? "You"
                    : `${member.firstName} ${member.lastName}`}
                  {index < selectedChatMembers.length - 1 && `,\u00A0`}
                  {/* Add a comma if it's not the last member */}
                </span>
              ))}
            </div>
          ) : (
            <div>Last Seen</div>
          )}
        </div>
        {/* {selectedChatType === "group" && (
          <div className="group-members">
            {selectedChatMembers.map((member, index) => (
              <div key={index} className="member">
                {member.firstName} {member.lastName}
              </div>
            ))}
          </div>
        )} */}
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
