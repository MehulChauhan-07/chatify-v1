import { useEffect, useRef, useState } from "react";
import "./SingleChatMessageContainer.css";
import { useAppStore } from "../../../store";
import { apiClient } from "../../../lib/api-client";
import {
  GET_ALL_MESSAGES_ROUTE,
  GET_GROUP_MEMBERS_ROUTE,
  GET_GROUP_MESSAGES_ROUTE,
  HOST,
} from "../../../utils/constants";
import moment from "moment";
import { BsFillTriangleFill } from "react-icons/bs";
import { MdChatBubble } from "react-icons/md";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { getColor } from "../../../lib/group-member-color";

const SingleChatMessageContainer = () => {
  const scrollRef = useRef();
  const scrollProgressRef = useRef();

  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
    selectedChatMembers,
    setSelectedChatMembers,
    uploadProgress,
    setUploadProgress,
    uploadTargetId,
    setUploadTargetId,
    uploadFileName,
    setUploadFileName,
  } = useAppStore();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );

        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getGroupMessages = async () => {
      try {
        // console.log("in get chan msg client");
        const response = await apiClient.get(
          `${GET_GROUP_MESSAGES_ROUTE}/${selectedChatData._id}`,
          { withCredentials: true }
        );
        // console.log("res above");
        // console.log(response);
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        // console.log("in get chan msg errr");
        console.log(error);
      }
    };

    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
      else if (selectedChatType === "group") {
        getGroupMessages();
      }
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  // useEffect(() => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollIntoView({ behavior: "instant" });
  //   }
  // }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);
  useEffect(() => {
    if (scrollProgressRef.current) {
      scrollProgressRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [uploadProgress]);

  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  const checkIfImage = (filePath) => {
    // Extract the part before the query parameters
    const pathWithoutParams = filePath.split("?")[0];

    // Define regex to check if it ends with a valid image extension
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif|jfif)$/i;

    // Test the cleaned path
    return imageRegex.test(pathWithoutParams);
  };

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");

      // console.log(index + "msg date: " + messageDate);
      // console.log("last date: " + lastDate);

      // console.log("message timestamp: " + message.timestamp);

      // const messageDay = Math.floor(messageDate / 86400000);
      // const lastDay = Math.floor(lastDate / 86400000);

      const showDate = messageDate !== lastDate;

      const isMessageDateToday =
        moment(Date.now()).format("YYYY-MM-DD") ===
        moment(message.timestamp).format("YYYY-MM-DD");
      const isMessageDateYesterday =
        moment(Date.now()).subtract(1, "days").format("YYYY-MM-DD") ===
        moment(message.timestamp).format("YYYY-MM-DD");
      const isMessageDateThisWeekExceptTodayAndYesterday =
        moment(Date.now()).subtract(2, "days").format("YYYY-MM-DD") ===
        moment(message.timestamp).format("YYYY-MM-DD");

      // const showDate = messageDay !== lastDay;

      lastDate = messageDate;

      // console.log("showDate: " + showDate);

      return (
        <div key={index}>
          {showDate && (
            <div className="general-date-container">
              <div className="general-date-line left"></div>
              <div className="general-date">
                {isMessageDateToday
                  ? "Today"
                  : isMessageDateYesterday
                  ? "Yesterday"
                  : isMessageDateThisWeekExceptTodayAndYesterday
                  ? moment(message.timestamp).format("dddd")
                  : // : moment(message.timestamp).format("LL")
                    moment(message.timestamp).format("L")}
              </div>
              <div className="general-date-line right"></div>
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "group" && renderGroupMessages(message)}
        </div>
      );
    });
  };

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", ""); // This forces a download -> Downloads with the original filename from the URL
    // link.setAttribute("download", "myFileName.extension"); // Downloads as "myImage.jpg" for example
    document.body.appendChild(link);
    link.click();
    // link.remove(); redundant -> below line already does the same thing
    document.body.removeChild(link);
  };

  // const shortenFileName = (fileName, maxLength = 81) => {
  //   if (fileName.length <= maxLength) {
  //     return fileName; // No need to shorten
  //   }

  //   const start = fileName.slice(0, 24); // First 10 characters
  //   const end = fileName.slice(-24); // Last 10 characters
  //   return `${start}...${end}`; // Combine with dots in the middle
  // };
  const shortenFileName = (fileName, maxLength = 81) => {
    if (fileName.length <= maxLength) {
      return fileName; // No need to shorten
    }

    const startLength = 24; // Length of the start part
    const endLength = 24; // Length of the end part

    const start = fileName.slice(0, startLength); // First 24 characters
    const end = fileName.slice(-endLength); // Last 24 characters

    const totalLength = fileName.length; // Total length of the original file name
    const dotsCount = totalLength - startLength - endLength; // Calculate number of dots

    // Create dots string based on calculated number
    const dots = dotsCount > 0 ? ".".repeat(dotsCount) : "";

    return `${start}${dots}${end}`; // Combine start, dots, and end
  };

  const getFileNameFromUrl = (fileName, maxLength = 81) => {
    if (!fileName) return "";

    // Find the last closing parenthesis ")"
    const lastClosingParenIndex = fileName.lastIndexOf(")");

    // Extract the file name part after the last closing parenthesis
    const cleanFileName =
      lastClosingParenIndex !== -1
        ? fileName.substring(lastClosingParenIndex + 1).trim()
        : fileName; // If no closing parenthesis, return the original file name

    // Ensure the file name is not longer than the maxLength
    return cleanFileName.length > maxLength
      ? cleanFileName.substring(0, maxLength) + "..."
      : cleanFileName;
  };

  // const getFileExtension = (fileName) => {
  //   if (!fileName) return ""; // Handle cases where the URL is undefined or null

  //   // Extract the extension (part after the last ".")
  //   const extension = fileName.includes(".") ? fileName.split(".").pop() : "";

  //   return extension;
  // };

  const renderDMMessages = (message) => (
    <div
      className={`message ${
        message.sender === selectedChatData._id
          ? "contact-message"
          : "own-message"
      }`}
    >
      <div
        className={`${
          message.sender !== selectedChatData._id
            ? "own-message-content"
            : "contact-message-content"
        } message-content`}
      >
        <div className="user-pointer">
          <MdChatBubble className="user-pointer-icon" />
        </div>
        {message.messageType === "text" && message.content}
        {message.messageType === "file" && message.fileUrl && (
          <div
          // className={`${
          //   message.messageType === "file" && checkIfImage(message.fileUrl)
          //     ? "image-outer-container"
          //     : ""
          // }`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="image-container"
                onClick={() => {
                  setShowImage(true);
                  setImageURL(message.fileUrl);
                }}
              >
                {/* <p>{message.fileUrl}</p> */}
                <img
                  src={message.fileUrl}
                  alt=""
                  style={{
                    width: "12.5rem",
                    height: "12.5rem",
                    // objectFit: "contain",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
                {/* <img src={message.fileUrl} alt="" /> */}
              </div>
            ) : (
              <div className="file-container">
                {/* <div className="file-icon-outer-container"> */}{" "}
                <div className="file-icon-container">
                  <MdFolderZip className="file-icon" />
                </div>
                {/* </div> */}
                <div className="file-name">
                  {/* {message.fileUrl.split("?")[0].split("/").pop()} */}
                  {/* {shortenFileName(
                    message.fileUrl.split("?")[0].split("/").pop()
                  )} */}
                  {getFileNameFromUrl(
                    message.fileUrl.split("?")[0].split("/").pop()
                  )}
                </div>
                <div className="download-icon-container-link">
                  <a
                    className="download-icon-container"
                    onClick={() => handleDownload(message.fileUrl)}
                  >
                    <IoMdArrowRoundDown className="download-icon" />
                  </a>
                </div>
              </div>
              // {
              //   getFileExtension(
              //     message.fileUrl.split("?")[0].split("/").pop()
              //   ) === "zip" ? (
              //     <MdFolderZip className="file-icon" />
              //   ) : getFileExtension(
              //       message.fileUrl.split("?")[0].split("/").pop()
              //     ) === "pdf" ? (
              //     <BiSolidFilePdf className="file-icon" />
              //   ) : getFileExtension(
              //       message.fileUrl.split("?")[0].split("/").pop()
              //     ) === "mp4" ||
              //     getFileExtension(
              //       message.fileUrl.split("?")[0].split("/").pop()
              //     ) === "webm" ||
              //     getFileExtension(
              //       message.fileUrl.split("?")[0].split("/").pop()
              //     ) === "avi" ? (
              //     <RiFolderVideoFill className="file-icon" />
              //   ) : getFileExtension(
              //       message.fileUrl.split("?")[0].split("/").pop()
              //     ) === "xlsx" ||
              //     getFileExtension(
              //       message.fileUrl.split("?")[0].split("/").pop()
              //     ) === "xls" ? (
              //     <RiFileExcel2Fill className="file-icon" />
              //   ) : getFileExtension(
              //       message.fileUrl.split("?")[0].split("/").pop()
              //     ) === "csv" ? (
              //     <FaFileCsv className="file-icon" />
              //   ) : getFileExtension(
              //       message.fileUrl.split("?")[0].split("/").pop()
              //     ) === "docx" ||
              //     getFileExtension(
              //       message.fileUrl.split("?")[0].split("/").pop()
              //     ) === "doc" ? (
              //     <FaFileWord className="file-icon" />
              //   ) : getFileExtension(
              //       message.fileUrl.split("?")[0].split("/").pop()
              //     ) === "pptx" ||
              //     getFileExtension(
              //       message.fileUrl.split("?")[0].split("/").pop()
              //     ) === "ppt" ? (
              //     <SiMicrosoftpowerpoint className="file-icon" />
              //   ) : getFileExtension(
              //       message.fileUrl.split("?")[0].split("/").pop()
              //     ) === "txt" ? (
              //     <BiSolidFileTxt className="file-icon" />
              //   ) : getFileExtension(
              //       message.fileUrl.split("?")[0].split("/").pop()
              //     ) === "json" ? (
              //     <BiSolidFileJson className="file-icon" />
              //   ) : getFileExtension(
              //       message.fileUrl.split("?")[0].split("/").pop()
              //     ) === "mp3" ? (
              //     <FaFileAudio className="file-icon" />
              //   ) : getFileExtension(
              //       message.fileUrl.split("?")[0].split("/").pop()
              //     ) === "html" ||
              //     getFileExtension(
              //       message.fileUrl.split("?")[0].split("/").pop()
              //     ) === "css" ||
              //     getFileExtension(
              //       message.fileUrl.split("?")[0].split("/").pop()
              //     ) === "js" ||
              //     getFileExtension(
              //       message.fileUrl.split("?")[0].split("/").pop()
              //     ) === "php" ||
              //     getFileExtension(
              //       message.fileUrl.split("?")[0].split("/").pop()
              //     ) === "py" ||
              //     getFileExtension(
              //       message.fileUrl.split("?")[0].split("/").pop()
              //     ) === "c" ||
              //     getFileExtension(
              //       message.fileUrl.split("?")[0].split("/").pop()
              //     ) === "cpp" ||
              //     getFileExtension(
              //       message.fileUrl.split("?")[0].split("/").pop()
              //     ) === "java" ||
              //     getFileExtension(
              //       message.fileUrl.split("?")[0].split("/").pop()
              //     ) === "sql" ? (
              //     <FaFileCode className="file-icon" />
              //   ) : (
              //     <FaFile className="file-icon" />
              //   )
              //   // checkIfImage(message.fileUrl)
              //   // ? (
              //   //   <MdImage className="file-icon" />
              //   // )
              //   // :
              // }
            )}
          </div>
        )}
        <div
          className={`${
            message.messageType === "file" && checkIfImage(message.fileUrl)
              ? "image-timestamp"
              : message.messageType === "file" && !checkIfImage(message.fileUrl)
              ? "file-timestamp"
              : ""
          } timestamp-container`}
        >
          <div className="message-timestamp">
            {/* {moment(message.timestamp).format("LT")} */}
            {moment(message.timestamp).format("LT")}
          </div>
        </div>
      </div>
      {/* <div className="message-timestamp">
        {moment(message.timestamp).format("LT")}
      </div> */}
      {/* </div> */}
    </div>
  );
  const renderGroupMessages = (message) => (
    <div
      className={`message group-message ${
        message.sender._id === userInfo.id ? "own-message" : "contact-message"
      }`}
    >
      {console.log("selectedChatData")}
      {console.log(selectedChatData)}
      {/* {console.log("userInfo: " + userInfo.id)}
      {console.log("sender: " + message.sender)}
      {console.log("sender _id: " + message.sender._id)} */}
      {/* {console.log("sender: " + selectedChatData._id)}
      {console.log(message.sender)} */}
      {message.sender._id === userInfo.id ? null : ( // </div> // </span> //   {moment(message.timestamp).format("LT")} // <span className="text-xs text-white/60"> // </span> //   {`${message.sender.firstName} ${message.sender.lastName}`} //  <span className="text-sm text-white/60"> // </div> //     : message.sender.email.split("").shift()} //     ? message.sender.firstName.split("").shift() //  {message.sender.firstName //     OA //   <div className="avatar"> // <div className="own-avatar">
        <div className="contact-avatar">
          {/* <div className="avatar">CA</div> */}
          <div className="avatar" style={{ color: "#53a6fd" }}>
            {message.sender.firstName && message.sender.lastName
              ? `${message.sender.firstName.charAt(
                  0
                )} ${message.sender.lastName.charAt(0)}`
              : message.sender.firstName
              ? message.sender.firstName.charAt(0)
              : message.sender.lastName
              ? message.sender.lastName.charAt(0)
              : message.sender.email.charAt(0)}
          </div>
        </div>
      )}
      <div
        className={`${
          message.sender._id === userInfo.id
            ? "own-message-content"
            : "contact-message-content"
        } message-content`}
      >
        <div className="user-pointer">
          <MdChatBubble className="user-pointer-icon" />
        </div>
        {message.sender._id !== userInfo.id && (
          <div className="group-message-contact-info-above-content">
            {/* <div className="contact-info" style={{color: getColor(message.sender._id)}}>{`${message.sender.firstName} ${message.sender.lastName}`}</div> */}
            {/* {console.log("group chat: " + message.name)}
            {console.log(message)} */}
            {/* {uploadProgress <= 0 ? ( */}
            <div
              className="contact-info"
              // style={{ color: getColor() }}
              style={{ color: "#53a6fd" }}
            >{`${message.sender.firstName} ${message.sender.lastName}`}</div>
            {/* ) : (
              <div className="contact-info">{`${message.sender.firstName} ${message.sender.lastName}`}</div>
            )} */}
          </div>
        )}
        {message.messageType === "text" && message.content}
        {message.messageType === "file" && message.fileUrl && (
          <div
          // className={`${
          //   message.messageType === "file" && checkIfImage(message.fileUrl)
          //     ? "image-outer-container"
          //     : ""
          // }`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="image-container"
                onClick={() => {
                  setShowImage(true);
                  setImageURL(message.fileUrl);
                }}
              >
                {/* <p>{message.fileUrl}</p> */}
                <img
                  src={message.fileUrl}
                  alt=""
                  style={{
                    width: "12.5rem",
                    height: "12.5rem",
                    // objectFit: "contain",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
                {/* <img src={message.fileUrl} alt="" /> */}
              </div>
            ) : (
              <div className="file-container">
                {/* <div className="file-icon-outer-container"> */}{" "}
                <div className="file-icon-container">
                  <MdFolderZip className="file-icon" />
                </div>
                {/* </div> */}
                <div className="file-name">
                  {/* {message.fileUrl.split("?")[0].split("/").pop()} */}
                  {/* {shortenFileName(
                    message.fileUrl.split("?")[0].split("/").pop()
                  )} */}
                  {getFileNameFromUrl(
                    message.fileUrl.split("?")[0].split("/").pop()
                  )}
                </div>
                <div className="download-icon-container-link">
                  <a
                    className="download-icon-container"
                    onClick={() => handleDownload(message.fileUrl)}
                  >
                    <IoMdArrowRoundDown className="download-icon" />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
        <div
          className={`${
            message.messageType === "file" && checkIfImage(message.fileUrl)
              ? "image-timestamp"
              : message.messageType === "file" && !checkIfImage(message.fileUrl)
              ? "file-timestamp"
              : ""
          } timestamp-container`}
        >
          <div className="message-timestamp">
            {/* {moment(message.timestamp).format("LT")} */}
            {moment(message.timestamp).format("LT")}
          </div>
        </div>
      </div>

      {/* <div className="message-timestamp">
        {moment(message.timestamp).format("LT")}
      </div> */}
      {/* </div> */}
    </div>
  );

  return (
    <div className="message-container">
      {renderMessages()}
      {uploadProgress > 0 && uploadTargetId === selectedChatData._id && (
        <>
          <div className="message own-message">
            <div className="message-content own-message-content">
              <div className="user-pointer">
                <MdChatBubble className="user-pointer-icon" />
              </div>
              <div>
                <div className="file-container">
                  <div className="file-icon-container">
                    <MdFolderZip className="file-icon" />
                  </div>
                  <div className="file-name">
                    {/* uploadProgress message */}
                    {`Uploading "${shortenFileName(
                      uploadFileName
                    )}": ${uploadProgress.toFixed(2)}%`}
                  </div>
                  <div className="download-icon-container-link">
                    <a
                      className="download-icon-container"
                      style={{ pointerEvents: "none" }}
                    >
                      <IoMdArrowRoundDown className="download-icon" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="timestamp-container file-timestamp">
                <div className="message-timestamp">
                  {/* {moment(message.timestamp).format("LT")} */}
                  {moment(Date.now()).format("LT")}
                </div>
              </div>
            </div>
          </div>
          <div ref={scrollProgressRef} />
          {/* <div ref={scrollRef} /> */}
        </>
      )}
      <div ref={scrollRef} />
    </div>
  );
};

export default SingleChatMessageContainer;
