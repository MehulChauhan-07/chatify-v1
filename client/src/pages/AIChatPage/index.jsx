import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPaperPlane, FaRobot, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useAppStore } from "../../store";
import "./index.css";

const AIChatPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useAppStore();
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    checkAIAvailability();
    loadChats();
  }, []);

  const checkAIAvailability = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/ai/availability`,
        { withCredentials: true }
      );
      setAiAvailable(response.data.available);
      if (!response.data.available) {
        toast.warning("AI service is not configured on the server.");
      }
    } catch (error) {
      console.error("Error checking AI availability:", error);
      toast.error("Failed to check AI service status.");
    }
  };

  const loadChats = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/ai/chats`,
        { withCredentials: true }
      );
      setChats(response.data.aiChats || []);
    } catch (error) {
      console.error("Error loading AI chats:", error);
      toast.error("Failed to load AI chats.");
    }
  };

  const createNewChat = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/ai/create`,
        {},
        { withCredentials: true }
      );
      const newChat = response.data.aiChat;
      setChats([newChat, ...chats]);
      setCurrentChat(newChat);
      setMessages([]);
    } catch (error) {
      console.error("Error creating new chat:", error);
      toast.error("Failed to create new chat.");
    }
  };

  const selectChat = async (chat) => {
    setCurrentChat(chat);
    setMessages(chat.messages || []);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !currentChat || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    // Add user message to UI immediately
    const tempUserMessage = {
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages([...messages, tempUserMessage]);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/ai/chat/${currentChat._id}/message`,
        { message: userMessage },
        { withCredentials: true }
      );

      // Update messages with the full chat history
      setMessages(response.data.aiChat.messages);
      setCurrentChat(response.data.aiChat);

      // Update chat in the list
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === currentChat._id ? response.data.aiChat : chat
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message.");
      // Remove the temporary user message on error
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChat = async (chatId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/ai/chat/${chatId}`,
        { withCredentials: true }
      );
      setChats(chats.filter((chat) => chat._id !== chatId));
      if (currentChat?._id === chatId) {
        setCurrentChat(null);
        setMessages([]);
      }
      toast.success("Chat deleted successfully.");
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat.");
    }
  };

  return (
    <div className="ai-chat-page">
      <div className="sidebar">
        <div className="sidebar-header">
          <button className="back-button" onClick={() => navigate("/chat")}>
            <FaArrowLeft />
          </button>
          <h2>AI Assistant</h2>
          <button className="new-chat-button" onClick={createNewChat}>
            + New Chat
          </button>
        </div>
        <div className="chat-list">
          {chats.map((chat) => (
            <div
              key={chat._id}
              className={`chat-item ${
                currentChat?._id === chat._id ? "active" : ""
              }`}
              onClick={() => selectChat(chat)}
            >
              <div className="chat-title">{chat.title}</div>
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat._id);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-container">
        {!currentChat ? (
          <div className="empty-state">
            <FaRobot size={64} color="#ccc" />
            <h3>Welcome to AI Assistant</h3>
            <p>Create a new chat to get started</p>
          </div>
        ) : (
          <>
            <div className="messages-container">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.role}`}
                >
                  <div className="message-icon">
                    {message.role === "user" ? (
                      <FaUser />
                    ) : (
                      <FaRobot />
                    )}
                  </div>
                  <div className="message-content">
                    {message.role === "assistant" ? (
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message assistant">
                  <div className="message-icon">
                    <FaRobot />
                  </div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form className="input-container" onSubmit={sendMessage}>
              <input
                type="text"
                placeholder="Ask me anything..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isLoading || !aiAvailable}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim() || !aiAvailable}
              >
                <FaPaperPlane />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AIChatPage;
