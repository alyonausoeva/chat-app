const jwt = require('jsonwebtoken');

const createAccessToken = (user) => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set');
  return jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const createRefreshToken = (user) => {
  if (!process.env.JWT_REFRESH_SECRET) throw new Error('JWT_REFRESH_SECRET is not set');
  return jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
};