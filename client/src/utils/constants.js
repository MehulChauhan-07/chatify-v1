export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO_ROUTE = `${AUTH_ROUTES}/user-info`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove-profile-image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const CONTACTS_ROUTES = "api/contacts";
export const SEARCH_CONTACTS_ROUTE = `${CONTACTS_ROUTES}/search`;
export const SEARCH_DM_CONTACTS_ROUTE = `${CONTACTS_ROUTES}/search-dm`;
export const GET_DM_CONTACTS_ROUTE = `${CONTACTS_ROUTES}/get-contacts-for-dm`;

export const MESSAGES_ROUTES = "api/messages";
export const GET_ALL_MESSAGES_ROUTE = `${MESSAGES_ROUTES}/get-messages`;

export const FRIEND_REQUEST_ROUTES = "api/friend-requests";
export const GET_FRIEND_REQUESTS_ROUTE = `${FRIEND_REQUEST_ROUTES}/get-friend-requests`;
export const CREATE_FRIEND_REQUEST_ROUTE = `${FRIEND_REQUEST_ROUTES}/create-friend-request`;
export const ACCEPT_FRIEND_REQUEST_ROUTE = `${FRIEND_REQUEST_ROUTES}/accept-friend-request`;
export const REJECT_FRIEND_REQUEST_ROUTE = `${FRIEND_REQUEST_ROUTES}/reject-friend-request`;
export const SEARCH_FRIEND_REQUESTS_ROUTE = `${FRIEND_REQUEST_ROUTES}/search-friend-requests`;
