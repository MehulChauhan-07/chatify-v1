import Message from "../models/MessageModel.js";
import User from "../models/UserModel.js";
import mongoose from "mongoose";

export const searchContacts = async (request, response, next) => {
  try {
    const { searchTerm } = request.body;
    const userId = request.userId;

    if (searchTerm === undefined || searchTerm === null) {
      return response.status(400).json({ error: "searchTerm is required" });
    }

    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const regex = new RegExp(sanitizedSearchTerm, "i");

    // Get the current user to retrieve the 'friends' list
    const currentUser = await User.findById(userId).select("friends");
    if (!currentUser) {
      return response.status(404).json({ error: "User not found" });
    }

    const friendsEmails = currentUser.friends; // Get the list of friends' emails

    const contacts = await User.find({
      $and: [
        { _id: { $ne: request.userId } },
        { email: { $in: friendsEmails } }, // Only return contacts whose email is in the friends list
        {
          $or: [
            { firstName: regex }, // Match first name
            { lastName: regex }, // Match last name
            { email: regex }, // Match email
            {
              $expr: {
                // Match full name
                $regexMatch: {
                  input: { $concat: ["$firstName", " ", "$lastName"] }, // Concatenate first and last name
                  regex: sanitizedSearchTerm,
                  options: "i",
                },
              },
            },
          ],
        },
      ],
    });

    return response.status(200).json({ contacts });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: error.message });
  }
};

export const searchDMContacts = async (request, response, next) => {
  try {
    const { searchTerm, directMessagesContacts } = request.body;
    const userId = request.userId;

    if (
      searchTerm === undefined ||
      searchTerm === null ||
      directMessagesContacts === undefined ||
      directMessagesContacts === null
    ) {
      return response
        .status(400)
        .json({ error: "searchTerm and directMessagesContacts are required" });
    }

    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const regex = new RegExp(sanitizedSearchTerm, "i");

    const directMessagesEmails = directMessagesContacts.map(
      (contact) => contact.email
    );

    // Perform a search only among the users whose emails are in the directMessagesEmails array
    const contacts = await User.find({
      $and: [
        { _id: { $ne: userId } }, // Exclude current user from the results
        { email: { $in: directMessagesEmails } }, // Only return contacts whose email is in the directMessagesEmails list
        {
          $or: [
            { firstName: regex }, // Match first name
            { lastName: regex }, // Match last name
            { email: regex }, // Match email
            {
              $expr: {
                $regexMatch: {
                  input: { $concat: ["$firstName", " ", "$lastName"] }, // Concatenate first and last name
                  regex: sanitizedSearchTerm,
                  options: "i",
                },
              },
            },
          ],
        },
      ],
    });

    return response.status(200).json({ contacts });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: error.message });
  }
};

export const getContactsForDMList = async (request, response, next) => {
  try {
    let { userId } = request;

    userId = new mongoose.Types.ObjectId(userId);
    // userId = new mongoose.Types.ObjectId.createFromHexString(userId);

    const contacts = await Message.aggregate([
      { $match: { $or: [{ sender: userId }, { recipient: userId }] } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
          lastMessageType: { $first: "$messageType" }, // Capture messageType
          lastMessageContent: { $first: "$content" }, // Capture text content
          lastFileUrl: { $first: "$fileUrl" }, // Capture file URL if applicable
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      { $unwind: "$contactInfo" },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          lastMessageType: 1,
          lastMessage: {
            $cond: {
              if: { $eq: ["$lastMessageType", "text"] }, // Check if it's a text message
              then: "$lastMessageContent", // Return text content
              else: "$lastFileUrl", // Otherwise, return file URL
            },
          },
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
      { $sort: { lastMessageTime: -1 } },
    ]);

    return response.status(200).json({ contacts });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: error.message });
  }
};

export const getAllContacts = async (request, response, next) => {
  try {
    const userId = request.userId;

    const currentUser = await User.findById(userId).select("friends");
    if (!currentUser) {
      return response.status(404).json({ error: "User not found" });
    }

    const friendsEmails = currentUser.friends; // Get the list of friends' emails

    const contacts = await User.find(
      {
        _id: { $ne: request.userId }, // Exclude the current user
        email: { $in: friendsEmails }, // Include only friends by email
      },
      "firstName lastName _id email"
    );

    return response.status(200).json({ contacts });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: error.message });
  }
};
