const chatModel = require("../models/chatModel");

const rpcMethods = {
  async createChat({ firstId, secondId }) {
    if (!firstId || !secondId) throw new Error("Both user IDs are required");

    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] }
    });

    if (chat) return chat;

    const newChat = new chatModel({
      members: [firstId, secondId]
    });

    const savedChat = await newChat.save();
    return savedChat;
  },

  async getUsersChats({ userId }) {
    if (!userId) throw new Error("User ID is required");

    const chats = await chatModel.find({
      members: { $in: [userId] }
    });

    return chats;
  }
};

module.exports = rpcMethods;