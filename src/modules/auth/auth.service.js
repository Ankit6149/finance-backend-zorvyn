const usersQueries = require("../../db/queries/users.queries");
const { hashValue, compareHash } = require("../../utils/hash");
const { createAccessToken } = require("../../utils/jwt");
const { ApiError } = require("../../utils/helper");

const sanitizeUser = (user) => {
  const safeUser = { ...user };
  delete safeUser.password_hash;
  return safeUser;
};

const register = async ({ name, email, password, role }) => {
  const existingUser = await usersQueries.getUserByEmail(email);
  if (existingUser) {
    throw new ApiError(409, "A user with this email already exists");
  }

  const roleData = await usersQueries.getRoleByName(role || "viewer");
  if (!roleData) {
    throw new ApiError(400, "Invalid role provided");
  }

  const passwordHash = await hashValue(password);

  const user = await usersQueries.createUser({
    name,
    email,
    passwordHash,
    roleId: roleData.id,
    status: "active",
  });

  const token = createAccessToken({ userId: user.id, role: user.role });

  return {
    user,
    token,
  };
};

const login = async ({ email, password }) => {
  const user = await usersQueries.getUserByEmail(email);
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const passwordMatches = await compareHash(password, user.password_hash);
  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (user.status !== "active") {
    throw new ApiError(403, "Your account is inactive");
  }

  const token = createAccessToken({ userId: user.id, role: user.role });

  return {
    user: sanitizeUser(user),
    token,
  };
};

module.exports = {
  register,
  login,
};
