import { IoMdMore } from "react-icons/io";
import { IoIosSearch } from "react-icons/io";
import "./SingleChatHeader.css";
import { useAppStore } from "../../../store";
import { GET_GROUP_MEMBERS_ROUTE } from "../../../utils/constants";
import { useEffect } from "react";
import { apiClient } from "../../../lib/api-client";

const SingleChatHeader = () => {
  const {
    selectedChatData,
    selectedChatType,
    setActiveIcon,
    selectedChatMembers,
    setSelectedChatMembers,
    userInfo,
    setContactOrGroupProfile,
  } = useAppStore();

  useEffect(() => {
    const getGroupMembers = async () => {
      try {
        const response = await apiClient.get(
          `${GET_GROUP_MEMBERS_ROUTE}/${selectedChatData._id}`,
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
        <div
          className="avatar"
          onClick={() => {
            setContactOrGroupProfile(selectedChatData);
            setActiveIcon("contactOrGroupProfile");
          }}
        >
          <img src="./avatar.png" />
        </div>
        <div
          className="info"
          onClick={() => {
            setContactOrGroupProfile(selectedChatData);
            setActiveIcon("contactOrGroupProfile");
          }}
        >
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
              {selectedChatMembers.map((member, index) => (
                <span key={member.id} className="member">
                  {member.id === userInfo.id
                    ? "You"
                    : `${member.firstName} ${member.lastName}`}
                  {index < selectedChatMembers.length - 1 && `,\u00A0`}
                </span>
              ))}
            </div>
          ) : (
            <div>Last Seen</div>
          )}
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
      </div>
    </div>
  );
};

export default SingleChatHeader;
