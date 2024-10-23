import { useEffect, useRef, useState } from "react";
import { RiChatNewFill } from "react-icons/ri";
import { IoMdMore } from "react-icons/io";
import { BsFillTriangleFill } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import "./FriendRequests.css";
import Chats from "../Chats";
import { useAppStore } from "../../../store";
import { apiClient } from "../../../lib/api-client";
import {
  GET_DM_CONTACTS_ROUTE,
  SEARCH_CONTACTS_ROUTE,
  GET_FRIEND_REQUESTS_ROUTE,
  SEARCH_FRIEND_REQUESTS_ROUTE,
  ACCEPT_FRIEND_REQUEST_ROUTE,
  REJECT_FRIEND_REQUEST_ROUTE,
} from "../../../utils/constants";
import { IoMdArrowRoundBack } from "react-icons/io";
import { toast } from "react-toastify";
import RequestChats from "../RequestChats";

const FriendRequests = () => {
  /*

  const { friendRequests, setFriendRequests } = useAppStore();

  useEffect(() => {
    const getFriendRequests = async () => {
      const response = await apiClient.get(GET_FRIEND_REQUESTS_ROUTE, {
        withCredentials: true,
      });
      if (response.data.contacts) {
        setFriendRequests(response.data.contacts);
      }
    };

    getFriendRequests();
  }, [refreshChatList, setFriendRequests]);

  const [searchedFriendRequests, setSearchedFriendRequests] = useState([]);

  const searchFriendRequests = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient.post(
          SEARCH_FRIEND_REQUESTS_ROUTE,
          { searchTerm },
          // { searchTerm, friendRequests },
          { withCredentials: true }
        );

        if (response.status === 200 && response.data.contacts) {
          setSearchedFriendRequests(response.data.contacts);
        }
      } else {
        setSearchedFriendRequests([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const approveFriendRequest = (contact) => {
    setSearchedFriendRequests([]);
    setRefreshChatList(false);
  };

  const [searching, setSearching] = useState(false);

  const onSearchInputChange = (event) => {
    if (event.target.value.length > 0) {
      setSearching(true);
    } else {
      setSearching(false);
    }
    searchFriendRequests(event.target.value);
  };

  const goBack = () => {
    setSearching(false);
    searchFriendRequests("");
    if (searchInputRef.current) {
      searchInputRef.current.value = ""; // Clear the search input when goBack is clicked
    }
  };

  const searchInputRef = useRef(null);

  */

  const {
    friendRequests,
    setFriendRequests,
    setFriendRequestsCount,
    refreshFriendRequests,
  } = useAppStore();

  useEffect(() => {
    // console.log("useeffect entered");
    const getFriendRequests = async () => {
      const response = await apiClient.get(GET_FRIEND_REQUESTS_ROUTE, {
        withCredentials: true,
      });
      if (response.data.friendRequests) {
        // console.log("Fetched friendRequests:", response.data.friendRequests);
        // setFriendRequestsCount(response.data.friendRequests.length);
        setFriendRequests(response.data.friendRequests);
      }
    };

    getFriendRequests();
    // }, [setFriendRequests, refreshFriendRequests]);
  }, [setFriendRequests]);

  // console.log("friendRequests: ", friendRequests);

  const [searching, setSearching] = useState(false);

  // const friendRequests = [
  //   { firstName: "John", lastName: "Doe", email: "john@gmail.com", _id: 1 },
  //   { firstName: "Jane", lastName: "Doe", email: "jane@gmail.com", _id: 2 },
  //   { firstName: "Aohn", lastName: "Doe", email: "aohn@gmail.com", _id: 3 },
  //   { firstName: "Bohn", lastName: "Doe", email: "bohn@gmail.com", _id: 4 },
  //   { firstName: "Cohn", lastName: "Doe", email: "cohn@gmail.com", _id: 5 },
  //   { firstName: "Dohn", lastName: "Doe", email: "dohn@gmail.com", _id: 6 },
  //   { firstName: "Eohn", lastName: "Doe", email: "eohn@gmail.com", _id: 7 },
  //   { firstName: "Fohn", lastName: "Doe", email: "fohn@gmail.com", _id: 8 },
  //   { firstName: "Gohn", lastName: "Doe", email: "gohn@gmail.com", _id: 9 },
  //   { firstName: "Hohn", lastName: "Doe", email: "hohn@gmail.com", _id: 10 },
  // ];

  // const searchedFriendRequests = [
  //   { firstName: "John", lastName: "Doe", email: "john@gmail.com", _id: 1 },
  //   { firstName: "Aohn", lastName: "Doe", email: "aohn@gmail.com", _id: 3 },
  //   { firstName: "Dohn", lastName: "Doe", email: "dohn@gmail.com", _id: 6 },
  //   { firstName: "Fohn", lastName: "Doe", email: "fohn@gmail.com", _id: 8 },
  //   { firstName: "Gohn", lastName: "Doe", email: "gohn@gmail.com", _id: 9 },
  // ];

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
      {/* {friendRequests.length > 0 ? ( */}
      <div className="request-chats-container">
        {showFR ? (
          <>
            <div className="filler-container">
              <div className="horizontal-filler"></div>
              <div className="scrollbar-triangle">
                <BsFillTriangleFill />
              </div>
            </div>
            {/* {searchedFriendRequests.length <= 0 */}
            {
              !showSFR ? (
                <RequestChats contacts={friendRequests} />
              ) : // <Chats contacts={friendRequests} />
              // <RequestChats contacts={searchedFriendRequests} />
              null
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
