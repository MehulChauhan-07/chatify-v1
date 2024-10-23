export const createChatSlice = (set, get) => ({
  activeChatId: undefined,
  refreshChatList: undefined,
  // refreshFriendRequests: undefined,
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessagesContacts: [],
  isSeen: false,
  uploadProgress: 0,
  uploadFileName: undefined,
  uploadTargetId: undefined,
  friendRequests: [],
  friendRequestsCount: 0,
  setFriendRequestsCount: (friendRequestsCount) => set({ friendRequestsCount }),
  setFriendRequests: (friendRequests) => set({ friendRequests }),
  // addFriendRequest: (friendRequest, requester) => {
  //   const { friendRequests } = get();
  // },
  addFriendRequestInFriendRequestsList: (friendRequest) => {
    const { friendRequests } = get();
    // set({ friendRequests: [...friendRequests, friendRequest] });
    get().setFriendRequests([...friendRequests, friendRequest]);
  },
  setUploadTargetId: (uploadTargetId) => set({ uploadTargetId }),
  setUploadFileName: (uploadFileName) => set({ uploadFileName }),
  setUploadProgress: (uploadProgress) => set({ uploadProgress }),
  setIsSeen: (isSeen) => set({ isSeen }),
  setActiveChatId: (activeChatId) => set({ activeChatId }),
  setRefreshChatList: (refreshChatList) => set({ refreshChatList }),
  // setRefreshFriendRequests: (refreshFriendRequests) =>
  //   set({ refreshFriendRequests }),
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),
  setDirectMessagesContacts: (directMessagesContacts) =>
    set({ directMessagesContacts }),
  closeChat: () =>
    set({
      selectedChatType: undefined,
      selectedChatData: undefined,
      selectedChatMessages: [],
    }),
  addMessage: (message) => {
    const { selectedChatMessages } = get();
    const { selectedChatType } = get();
    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          recipient:
            selectedChatType === "channel"
              ? message.recipient
              : message.recipient._id,
          sender:
            selectedChatType === "channel"
              ? message.sender
              : message.sender._id,
        },
      ],
    });
  },
  addContactsInDMContacts: (message) => {
    const userId = get().userInfo.id;
    const fromId =
      message.sender._id === userId
        ? message.recipient._id
        : message.sender._id;
    const fromData =
      message.sender._id === userId ? message.recipient : message.sender;
    const dmContacts = get().directMessagesContacts;
    const data = dmContacts.find((contact) => contact._id === fromId);
    const index = dmContacts.findIndex((contact) => contact._id === fromId);
    if (index !== -1 && index !== undefined) {
      dmContacts.splice(index, 1);
      dmContacts.unshift(data);
    } else {
      dmContacts.unshift(fromData);
    }
    set({ directMessagesContacts: dmContacts });
  },
});
