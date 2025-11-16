import { Router } from "express";

import {
  createGroup,
  getGroupMessages,
  getUserGroups,
  getGroupsInCommon,
  getGroupMembers,
  searchGroups,
  getGroupFiles,
  addGroupAdmin,
  removeGroupAdmin,
  transferGroupOwnership,
  updateGroupNotificationSettings,
} from "../controllers/GroupControllers.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const groupRoutes = Router();

groupRoutes.post("/create-group", verifyToken, createGroup);
groupRoutes.get("/get-user-groups", verifyToken, getUserGroups);
groupRoutes.get(
  "/get-groups-in-common/:contactId",
  verifyToken,
  getGroupsInCommon
);
groupRoutes.get("/get-group-messages/:groupId", verifyToken, getGroupMessages);
groupRoutes.get("/get-group-members/:groupId", verifyToken, getGroupMembers);
groupRoutes.post("/search-groups", verifyToken, searchGroups);
groupRoutes.get("/get-group-files/:groupId", verifyToken, getGroupFiles);
groupRoutes.post("/:groupId/add-admin", verifyToken, addGroupAdmin);
groupRoutes.post("/:groupId/remove-admin", verifyToken, removeGroupAdmin);
groupRoutes.post("/:groupId/transfer-ownership", verifyToken, transferGroupOwnership);
groupRoutes.put("/:groupId/notification-settings", verifyToken, updateGroupNotificationSettings);

export default groupRoutes;
