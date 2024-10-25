import { useEffect, useState } from "react";
import { BsFillTriangleFill } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import "./FriendRequests.css";
import { useAppStore } from "../../../store";
import { apiClient } from "../../../lib/api-client";
import { GET_FRIEND_REQUESTS_ROUTE } from "../../../utils/constants";
import { IoMdArrowRoundBack } from "react-icons/io";
import { toast } from "react-toastify";
import RequestChats from "../RequestChats";

const FriendRequests = () => {
  const { friendRequests, setFriendRequests } = useAppStore();

  useEffect(() => {
    const getFriendRequests = async () => {
      const response = await apiClient.get(GET_FRIEND_REQUESTS_ROUTE, {
        withCredentials: true,
      });
      if (response.data.friendRequests) {
        setFriendRequests(response.data.friendRequests);
      }
    };

    getFriendRequests();
  }, [setFriendRequests]);

  // console.log("friendRequests: ", friendRequests);

  const [searching, setSearching] = useState(false);

  const showFR = true;
  const showSFR = false;

  return (
    <div className="friend-requests">
      <div className="header">
        <div className="sub-header">
          <h1>Friend Requests</h1>
        </div>
        <div className="search-form">
          <div className="search-icon">
            {searching ? (
              // <div className="search-go-back-arrow" onClick={() => goBack()}>
              <div className="search-go-back-arrow">
                <IoMdArrowRoundBack />
              </div>
            ) : (
              <label htmlFor="search">
                <IoIosSearch />
              </label>
            )}
          </div>

          <input
            id="search"
            type="text"
            className="search-input"
            // onChange={(event) => onSearchInputChange(event)}
            // ref={searchInputRef}
            placeholder="Search a request"
          />
        </div>
      </div>
      <div className="request-chats-container">
        {showFR ? (
          <>
            <div className="filler-container">
              <div className="horizontal-filler"></div>
              <div className="scrollbar-triangle">
                <BsFillTriangleFill />
              </div>
            </div>
            {
              !showSFR ? <RequestChats contacts={friendRequests} /> : null
              // <Chats contacts={searchedFriendRequests} />
            }
            <div className="filler-container">
              <div className="horizontal-filler"></div>
              <div className="scrollbar-triangle-upside-down">
                <BsFillTriangleFill />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default FriendRequests;
