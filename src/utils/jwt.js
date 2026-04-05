const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

const createAccessToken = (payload) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

const verifyAccessToken = (token) => jwt.verify(token, env.JWT_SECRET);

module.exports = {
  createAccessToken,
  verifyAccessToken,
};
