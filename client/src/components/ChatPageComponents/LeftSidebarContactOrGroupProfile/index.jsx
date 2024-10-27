import { useEffect, useState } from "react";
import "./LeftSidebarContactOrGroupProfile.css";
import moment from "moment";
import { useAppStore } from "../../../store";
import { apiClient } from "../../../lib/api-client";
import {
  GET_GROUP_MEMBERS_ROUTE,
  GET_GROUPS_IN_COMMON_ROUTE,
  GET_USER_GROUPS_ROUTE,
} from "../../../utils/constants";

const LeftSidebarContactOrGroupProfile = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const handleFilterClick = (filterName) => {
    setActiveFilter(filterName);
  };

  const {
    activeIcon,
    setActiveIcon,
    userInfo,
    setUserInfo,
    closeChat,
    contactOrGroupProfile,
    setSelectedChatType,
    setSelectedChatData,
    selectedChatData,
    setSelectedChatMessages,
    setActiveChatId,
  } = useAppStore();

  const [groupsInCommon, setGroupsInCommon] = useState([]);
  const [files, setFiles] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);

  useEffect(() => {
    const getGroupsInCommon = async () => {
      try {
        const response = await apiClient.get(
          `${GET_GROUPS_IN_COMMON_ROUTE}/${contactOrGroupProfile._id}`,
          { withCredentials: true }
        );

        if (response.status === 201 && response.data.groups) {
          setGroupsInCommon(response.data.groups);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getGroupMembers = async () => {
      try {
        const response = await apiClient.get(
          `${GET_GROUP_MEMBERS_ROUTE}/${contactOrGroupProfile._id}`,
          { withCredentials: true }
        );

        if (response.data.members) {
          setGroupMembers(response.data.members);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (!contactOrGroupProfile.name) {
      console.log(contactOrGroupProfile._id);
      getGroupsInCommon();
      // getContactFiles();
    } else if (contactOrGroupProfile.name) {
      getGroupMembers();
      // getGroupFiles();
    }
  }, [contactOrGroupProfile]);

  return (
    <div className="left-sidebar-contact-or-group-profile">
      <h1>
        {contactOrGroupProfile.name
          ? contactOrGroupProfile.name
          : `${contactOrGroupProfile.firstName} ${contactOrGroupProfile.lastName}`}
      </h1>

      {/* {console.log("contactOrGroupProfile:")}
      {console.log(contactOrGroupProfile)} */}

      <div className="info-container">
        <div className="info-inputs">
          {!contactOrGroupProfile.name &&
            (contactOrGroupProfile.image ? (
              <div className="info-input-container">
                <img
                  src={contactOrGroupProfile.image}
                  alt=""
                  // alt="profile-image"
                  className="profile-image"
                />
              </div>
            ) : (
              <div className="profile-image">
                <svg
                  viewBox="0 0 340 340"
                  // className="profile-image-default-user-svg"
                  xmlns="http://www.w3.org/2000/svg"
                  width="340"
                  height="340"
                >
                  <path
                    fill="#2c2e3b"
                    d="m169,.5a169,169 0 1,0 2,0zm0,86a76,76 0 1
  1-2,0zM57,287q27-35 67-35h92q40,0 67,35a164,164 0 0,1-226,0"
                  />
                </svg>
              </div>
            ))}
          <div className="info-input-container">
            <div className="info-input disabled">
              {contactOrGroupProfile.name
                ? // moment(contactOrGroupProfile.createdAt).format("YYYY-MM-DD")
                  moment(contactOrGroupProfile.createdAt).format("L")
                : `${contactOrGroupProfile.email}`}
            </div>
          </div>
          <div className="info-input-container">
            <div className="info-input disabled">
              {contactOrGroupProfile.name ? (
                groupMembers.length > 0 ? (
                  <div>
                    {groupMembers.map((member) => (
                      <div className="group-member" key={member._id}>
                        {member.id === userInfo.id
                          ? "You"
                          : `${member.firstName} ${member.lastName}`}
                      </div>
                    ))}
                  </div>
                ) : (
                  "no members"
                )
              ) : (
                `${contactOrGroupProfile.firstName} ${contactOrGroupProfile.lastName}`
              )}
            </div>
          </div>
          {!contactOrGroupProfile.name && (
            <div className="info-input-container">
              <div className="info-input">
                {groupsInCommon.length > 0 ? (
                  <div>
                    {groupsInCommon.map((group) => (
                      <div
                        className="group-in-common"
                        key={group._id}
                        // onClick={() => handleGroupInCommonClick(group)}
                      >
                        {group.name}
                      </div>
                    ))}
                  </div>
                ) : (
                  "no groups in common"
                )}
              </div>
            </div>
          )}
          <div className="info-input-container">
            <div className="info-input disabled">
              {contactOrGroupProfile.name ? "group files" : "contact files"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebarContactOrGroupProfile;
