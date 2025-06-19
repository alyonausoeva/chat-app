const mongoose = require('mongoose');
const messageModel = require('../models/messageModel');

module.exports = {
  async createMessage({ chatId, senderId, text }) {
    if (!chatId || !senderId || !text) throw new Error('Missing required fields');

    const message = new messageModel({ chatId, senderId, text });
    return await message.save();
  },

  async getMessages({ chatId, limit = 20, before }) {
    if (!chatId) throw new Error('chatId is required');

    const query = { chatId };

    if (before) {
      query._id = { $lt: new mongoose.Types.ObjectId(before) };
    }

    const messages = await messageModel
      .find(query)
      .sort({ _id: -1 })
      .limit(limit);

    const oldestId = messages.length > 0 ? messages[messages.length - 1]._id : null;

    let remaining = 0;
    if (oldestId) {
      remaining = await messageModel.countDocuments({
        chatId,
        _id: { $lt: oldestId },
      });
    }

    return {
      messages: messages.slice().reverse(),
      hasMore: remaining > 0,
    };
  },

  async getLastMessage({ chatId }) {
    if (!chatId) throw new Error('chatId is required');

    const lastMessage = await messageModel
      .findOne({ chatId })
      .sort({ _id: -1 });

    return lastMessage || { text: null };
  }
};