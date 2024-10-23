import { useEffect, useState } from "react";
import { RiChatNewFill } from "react-icons/ri";
import { IoMdMore } from "react-icons/io";
import { BsFillTriangleFill } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import "./LeftSidebarProfile.css";
import Chats from "../Chats";
import { useAppStore } from "../../../store";
import { apiClient } from "../../../lib/api-client";
import {
  GET_DM_CONTACTS_ROUTE,
  HOST,
  LOGOUT_ROUTE,
  SEARCH_CONTACTS_ROUTE,
  UPDATE_PROFILE_ROUTE,
} from "../../../utils/constants";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LeftSidebarProfile = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const handleFilterClick = (filterName) => {
    setActiveFilter(filterName);
  };

  const { activeIcon, setActiveIcon, userInfo, setUserInfo, closeChat } =
    useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First name is required");
      return false;
    }
    if (!lastName) {
      toast.error("Last name is required");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          {
            firstName,
            lastName,
            color: selectedColor,
          },
          {
            withCredentials: true,
          }
        );

        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          setActiveIcon("chat");
          toast.success("Profile updated successfully");
          // navigate("/chat");
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  // const handleNavigate = () => {
  //   if (userInfo.profileSetup) {
  //     navigate("/chat");
  //   } else {
  //     toast.error("Please set up your profile first");
  //   }
  // };

  // const handleFileInputClick = () => {
  //   fileInputRef.current.click();
  // };

  const navigate = useNavigate();

  const logOut = async () => {
    try {
      const response = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        navigate("/auth");
        setUserInfo(null);
        closeChat();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="left-sidebar-profile">
      <h1>Profile</h1>

      <div className="info-container">
        {/* <div
          className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Avatar className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden">
            {image ? (
              <AvatarImage
                src={image}
                alt="profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                  selectedColor
                )}`}
              >
                {firstName
                  ? firstName.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </Avatar>
          {hovered && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full"
              onClick={image ? handleDeleteImage : handleFileInputClick}
            >
              {image ? (
                <FaTrash className="text-white text-3xl cursor-pointer" />
              ) : (
                <FaPlus className="text-white text-3xl cursor-pointer" />
              )}
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
            name="profile-image"
            accept="image/png, image/jpeg, image/jpg, image/svg, image/webp, image/jfif"
          />
        </div> */}

        <div className="info-inputs">
          <div className="info-input-container">
            <input
              placeholder="Email"
              type="email"
              disabled
              value={userInfo.email}
              className="info-input disabled"
            />
          </div>
          <div className="info-input-container">
            <input
              placeholder="First Name"
              type="text"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              className="info-input"
            />
          </div>
          <div className="info-input-container">
            <input
              placeholder="Last Name"
              type="text"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              className="info-input"
            />
          </div>
          {/* <div className="info-input-container">
            {colors.map((color, index) => (
              <div
                // className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                // className={`${color} h-8 w-8 rounded-full cursor-pointer ${
                //   selectedColor === index
                //     ? "outline outline-white/50 outline-3"
                //     : ""
                // }`}
                // className=""
                // outline style changes (outline is enlarged) when you put an extra unnecessary curly bracket above like }}`} instead of }`}. BUT WHY??? DOESN'T MAKE ANY SENSE!!!
                key={index}
                onClick={() => setSelectedColor(index)}
              ></div>
            ))}
          </div> */}
        </div>
        <div className="info-input-container">
          <button className="info-button" onClick={saveChanges}>
            Save Changes
          </button>
        </div>
        <div className="info-input-container">
          <button className="logout-button" onClick={logOut}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebarProfile;
