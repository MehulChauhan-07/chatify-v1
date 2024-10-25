import { useEffect, useState } from "react";
import "./LeftSidebarProfile.css";
import { useAppStore } from "../../../store";
import { apiClient } from "../../../lib/api-client";
import {
  HOST,
  LOGOUT_ROUTE,
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
        {/* <div>
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
