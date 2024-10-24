import { BsChatLeftText } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMailOutline } from "react-icons/io5";
import "./LeftSidebar.css";
import { useAppStore } from "../../../store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { apiClient } from "../../../lib/api-client";
import { GET_FRIEND_REQUESTS_ROUTE } from "../../../utils/constants";

const LeftSidebar = () => {
  const { activeIcon, setActiveIcon, userInfo } = useAppStore();

  const navigate = useNavigate();

  const handleIconClick = (iconName) => {
    // if (iconName == "avatar") {
    //   // setActiveIcon(undefined);
    //   // navigate("/profile");
    // } else if (iconName == "settings") {
    //   setActiveIcon(iconName);
    //   // navigate("/settings");
    // } else {
    //   setActiveIcon(iconName);
    //   // navigate("/chat");
    // }

    setActiveIcon(iconName);

    // notifyParentOfActiveIcon(activeIcon);
  };

  const { friendRequestsCount, setFriendRequestsCount } = useAppStore();

  useEffect(() => {
    setActiveIcon("chat");

    const getFriendRequests = async () => {
      const response = await apiClient.get(GET_FRIEND_REQUESTS_ROUTE, {
        withCredentials: true,
      });
      if (response.data.friendRequests) {
        // console.log("Fetched friendRequests:", response.data.friendRequests);
        setFriendRequestsCount(response.data.friendRequests.length);
      }
    };

    getFriendRequests();
  }, []);

  return (
    <div className="left-sidebar">
      <div className="icon-container">
        <div
          //   className="icon"
          className={`tooltip icon ${
            activeIcon === "chat" ? "active-icon" : ""
          }`}
          onClick={() => handleIconClick("chat")}
        >
          <BsChatLeftText />
          <span className="tooltiptext">Chats</span>
        </div>
      </div>
      <div className="icon-container">
        <div
          //   className="icon"
          className={`tooltip icon friend-requests-icon-container ${
            activeIcon === "friend-requests" ? "active-icon" : ""
          }`}
          onClick={() => handleIconClick("friend-requests")}
        >
          {friendRequestsCount > 0 && (
            <div className="friend-requests-count">{friendRequestsCount}</div>
          )}
          <IoMailOutline />
          <span className="tooltiptext">Requests</span>
        </div>
      </div>
      <div className="between-icon-vertical-space-filler"></div>
      <div className="icon-container">
        <div
          //   className="icon"
          className={`tooltip icon currently-disabled-icon ${
            activeIcon === "settings" ? "active-icon" : ""
          }`}
          // onClick={() => handleIconClick("settings")}
        >
          <IoSettingsOutline />
          <span className="tooltiptext">Settings</span>
        </div>
      </div>
      <div className="icon-container">
        <div
          //   className="icon"
          className={`tooltip icon ${
            activeIcon === "avatar" ? "active-icon" : ""
          }`}
          onClick={() => handleIconClick("avatar")}
        >
          {/* <img className="avatar" src="/avatar.png" alt="Avatar" /> */}
          <div className="avatar">
            <div className="img">
              {userInfo.firstName && userInfo.lastName
                ? `${userInfo.firstName.charAt(0)} ${userInfo.lastName.charAt(
                    0
                  )}`
                : userInfo.firstName
                ? userInfo.firstName.charAt(0)
                : userInfo.lastName
                ? userInfo.lastName.charAt(0)
                : userInfo.email.charAt(0)}
            </div>
          </div>
          <span className="tooltiptext">Profile</span>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
