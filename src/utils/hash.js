const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

const hashValue = (value) => bcrypt.hash(value, SALT_ROUNDS);
const compareHash = (plainText, hashedValue) =>
  bcrypt.compare(plainText, hashedValue);

module.exports = {
  hashValue,
  compareHash,
};
