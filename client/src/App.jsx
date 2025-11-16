import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { MainLayout } from "./components/layout/MainLayout.jsx";
import { ChatList } from "./components/chat/ChatList.jsx";
import { useAppStore } from "./store";
import { apiClient } from "./lib/api-client";
import { GET_USER_INFO_ROUTE } from "./utils/constants";
import "./styles/globals.css";

function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        console.log('Fetching user info from:', GET_USER_INFO_ROUTE);
        const response = await apiClient.get(GET_USER_INFO_ROUTE);
        console.log('User info response:', response.data);
        
        if (response.data && response.data.id) {
          setUserInfo({
            id: response.data.id,
            email: response.data.email,
            profileSetup: response.data.profileSetup,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            image: response.data.image,
            color: response.data.color,
            isAdmin: response.data.isAdmin,
          });
          console.log('User info set successfully');
        } else {
          console.warn('No user info in response');
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        // User is not authenticated, but we'll still show the app
        // In a real app, you might want to redirect to login
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [setUserInfo]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MainLayout>
        <div className="flex h-full">
          <ChatList />
          <div className="flex-1 flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
                Welcome to Chatify
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Select a conversation to start messaging
              </p>
            </div>
          </div>
        </div>
      </MainLayout>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--color-bg-primary)",
            color: "var(--color-text-primary)",
            border: "1px solid var(--color-border-primary)",
          },
        }}
      />
    </>
  );
}

export default App;
