const bcrypt = require('bcrypt');
const validator = require('validator');
const userModel = require('../models/user');
const { createAccessToken, createRefreshToken } = require('../utils/token');
const jwt = require('jsonwebtoken');

const randomEmoji = () => {
  const emojis = [
    '😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰',
    '😘','😗','😙','😚','😋','😜','😝','😛','🤑','🤗','🤩','🤔','🤨','😐','😑','😶',
    '🙄','😏','😒','😞','😔','😟','😕','☹️','😣','😖','😫','😩','🥺','😢','😭','😤',
    '😠','😡','🤬','😲','😳','🥵','🥶','😱','😨','😰','😥','😓','🤤','😴','😪','😵',
    '🤐','🥴','🤢','🤮','🤕','🤒','🧐','🤓','😎','🥸','😈','👿','🤠','😺','😸','😹',
    '😻','😼','😽','🙀','😿','😾'
  ];
  return emojis[Math.floor(Math.random() * emojis.length)];
};

const rpcMethods = {
  async register({ name, email, password }) {
    if (!name || !email || !password) throw new Error('All fields required');
    if (!validator.isEmail(email)) throw new Error('Invalid email');

    const existing = await userModel.findOne({ email });
    if (existing) throw new Error('Email already in use');

    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name,
      email,
      password: hash,
      avatar: randomEmoji()
    });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      accessToken,
      refreshToken
    };
  },

  async login({ email, password }) {
    const user = await userModel.findOne({ email });
    if (!user) throw new Error('User not found');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid password');

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      accessToken,
      refreshToken
    };
  },

  async refreshToken({ token }) {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await userModel.findById(decoded._id);
    if (!user || user.refreshToken !== token) throw new Error('Invalid refresh token');

    const accessToken = createAccessToken(user);
    const newRefresh = createRefreshToken(user);
    user.refreshToken = newRefresh;
    await user.save();

    return {
      accessToken,
      refreshToken: newRefresh
    };
  },

  async getUser({ userId }) {
    const user = await userModel.findById(userId).select('_id name email avatar');
    if (!user) throw new Error('User not found');
    return user;
  },

  async getUsers() {
    try {
      const users = await userModel.find().select('_id name email avatar');
      return users;
    } catch (err) {
      throw new Error(err.message);
    }
  }
};

module.exports = rpcMethods;
