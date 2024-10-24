import { useEffect, useState } from "react";
import { RiChatNewFill } from "react-icons/ri";
import { IoMdMore } from "react-icons/io";
import { BsFillTriangleFill } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import "./LeftSidebarContactOrGroupProfile.css";
import Chats from "../Chats";
import { useAppStore } from "../../../store";
import { apiClient } from "../../../lib/api-client";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
  } = useAppStore();
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  // const [image, setImage] = useState(null);
  // const [hovered, setHovered] = useState(false);
  // const [selectedColor, setSelectedColor] = useState(0);

  useEffect(() => {
    // if (userInfo.profileSetup) {
    //   setFirstName(userInfo.firstName);
    //   setLastName(userInfo.lastName);
    //   setSelectedColor(userInfo.color);
    // }
    // if (userInfo.image) {
    //   setImage(`${HOST}/${userInfo.image}`);
    // }
  }, [contactOrGroupProfile]);

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
                ? "group creation date"
                : `${contactOrGroupProfile.email}`}
            </div>
          </div>
          <div className="info-input-container">
            <div className="info-input disabled">
              {contactOrGroupProfile.name
                ? "group members"
                : `${contactOrGroupProfile.firstName} ${contactOrGroupProfile.lastName}`}
            </div>
          </div>
          {!contactOrGroupProfile.name && (
            <div className="info-input-container">
              <div className="info-input disabled">{"common group(s)"}</div>
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
