const usersQueries = require("../../db/queries/users.queries");
const { hashValue } = require("../../utils/hash");
const { ApiError } = require("../../utils/helper");

const createUser = async ({ name, email, password, role, status }) => {
  const existingUser = await usersQueries.getUserByEmail(email);
  if (existingUser) {
    throw new ApiError(409, "A user with this email already exists");
  }

  const roleData = await usersQueries.getRoleByName(role);
  if (!roleData) {
    throw new ApiError(400, "Invalid role provided");
  }

  const passwordHash = await hashValue(password);

  return usersQueries.createUser({
    name,
    email,
    passwordHash,
    roleId: roleData.id,
    status,
  });
};

const getAllUsers = async ({ status, role, page, limit }) => {
  const offset = (page - 1) * limit;
  const result = await usersQueries.getAllUsers({
    status,
    role,
    limit,
    offset,
  });

  return {
    items: result.users,
    pagination: {
      page,
      limit,
      totalItems: result.total,
      totalPages: Math.max(1, Math.ceil(result.total / limit)),
    },
  };
};

const getUserById = async (id) => {
  const user = await usersQueries.getUserById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

const updateUserStatus = async (id, status) => {
  const user = await usersQueries.updateUserStatus(id, status);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

const updateUserRole = async (id, role) => {
  const roleData = await usersQueries.getRoleByName(role);
  if (!roleData) {
    throw new ApiError(400, "Invalid role provided");
  }

  const user = await usersQueries.updateUserRole(id, roleData.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

const deleteUser = async (id) => {
  const deleted = await usersQueries.deleteUser(id);
  if (!deleted) {
    throw new ApiError(404, "User not found");
  }
  return deleted;
};

const getCurrentUser = async (id) => {
  const user = await usersQueries.getUserById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getCurrentUser,
};
