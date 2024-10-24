import { useEffect, useState } from "react";
import { RiChatNewFill } from "react-icons/ri";
import { IoMdMore } from "react-icons/io";
import { BsFillTriangleFill } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import "./LeftSidebarContactOrGroupProfile.css";
import Chats from "../Chats";
import moment from "moment";
import { useAppStore } from "../../../store";
import { apiClient } from "../../../lib/api-client";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
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
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  // const [image, setImage] = useState(null);
  // const [hovered, setHovered] = useState(false);
  // const [selectedColor, setSelectedColor] = useState(0);

  const [groupsInCommon, setGroupsInCommon] = useState([]);
  const [files, setFiles] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);

  useEffect(() => {
    const getGroupsInCommon = async () => {
      try {
        // console.log("x");
        const response = await apiClient.get(
          `${GET_GROUPS_IN_COMMON_ROUTE}/${contactOrGroupProfile._id}`,
          { withCredentials: true }
        );
        // console.log("xed");

        if (response.status === 201 && response.data.groups) {
          setGroupsInCommon(response.data.groups);
        }
      } catch (error) {
        console.log(error);
      }
    };

    // const getContactFiles = async () => {
    //   try {
    //     const response = await apiClient.get(
    //       `${GET_CONTACT_FILES_ROUTE}/${contactOrGroupProfile._id}`,
    //       { withCredentials: true }
    //     );

    //     if (response.data.files) {
    //       setFiles(response.data.files);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    // const getGroupFiles = async () => {
    //   try {
    //     // console.log("in get chan msg client");
    //     const response = await apiClient.get(
    //       `${GET_GROUP_FILES_ROUTE}/${contactOrGroupProfile._id}`,
    //       { withCredentials: true }
    //     );

    //     if (response.data.files) {
    //       setFiles(response.data.files);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    const getGroupMembers = async () => {
      try {
        const response = await apiClient.get(
          `${GET_GROUP_MEMBERS_ROUTE}/${contactOrGroupProfile._id}`,
          // { members: selectedChatData.members },
          { withCredentials: true }
        );

        if (response.data.members) {
          setGroupMembers(response.data.members);
        }
      } catch (error) {
        console.log(error);
      }
    };

    // if (selectedChatData._id) {
    //   if (selectedChatType === "contact") getMessages();
    //   else if (selectedChatType === "group") {
    //     getGroupMessages();
    //   }
    // }
    if (!contactOrGroupProfile.name) {
      // console.log("calling");
      console.log(contactOrGroupProfile._id);
      getGroupsInCommon();
      // getContactFiles();
      // console.log("called");
    } else if (contactOrGroupProfile.name) {
      getGroupMembers();
      // getGroupFiles();
    }
  }, [contactOrGroupProfile]);

  // const handleGroupInCommonClick = (group) => {
  //   setSelectedChatType("group");
  //   setSelectedChatData(group);

  //   console.log("group");
  //   console.log(group);

  //   // setActiveChatId(group._id);

  //   // if (
  //   //   selectedChatData &&
  //   //   selectedChatData._id !== contactOrGroupProfile._id
  //   // ) {
  //   //   setSelectedChatMessages([]);
  //   //   // setActiveChat(false);
  //   // }
  // };

  return (
    <div className="left-sidebar-contact-or-group-profile">
      <h1>
        {contactOrGroupProfile.name
          ? contactOrGroupProfile.name
          : `${contactOrGroupProfile.firstName} ${contactOrGroupProfile.lastName}`}
      </h1>

      <div className="info-container">
        <div className="info-inputs">
          <div className="info-input-container">
            <div className="info-input disabled">
              {contactOrGroupProfile.name
                ? // ? `${contactOrGroupProfile.createdAt}`
                  // moment(contactOrGroupProfile.createdAt).format("YYYY-MM-DD")
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
                        {member.firstName} {member.lastName}
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
