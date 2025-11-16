import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
  getAllContacts,
  getContactsForDMList,
  searchContacts,
  searchDMContacts,
  getContactFiles,
  getUserStatus,
  updateChatSettings,
  getChatSettings,
} from "../controllers/ContactsController.js";

const contactsRoutes = Router();

contactsRoutes.post("/search", verifyToken, searchContacts);
contactsRoutes.post("/search-dm", verifyToken, searchDMContacts);
contactsRoutes.get("/get-contacts-for-dm", verifyToken, getContactsForDMList);
contactsRoutes.get("/get-all-contacts", verifyToken, getAllContacts);
contactsRoutes.get(
  "/get-contact-files/:contactId",
  verifyToken,
  getContactFiles
);
contactsRoutes.get("/status/:userId", verifyToken, getUserStatus);
contactsRoutes.put("/chat-settings", verifyToken, updateChatSettings);
contactsRoutes.get("/chat-settings", verifyToken, getChatSettings);

export default contactsRoutes;
