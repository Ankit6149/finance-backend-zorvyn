const userService = require("./user.service");
const { asyncHandler } = require("../../utils/helper");

const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user,
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const result = await userService.getAllUsers(req.query);
  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    data: result,
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: user,
  });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await userService.updateUserStatus(req.params.id, req.body.status);
  res.status(200).json({
    success: true,
    message: "User status updated successfully",
    data: user,
  });
});

const updateUserRole = asyncHandler(async (req, res) => {
  const user = await userService.updateUserRole(req.params.id, req.body.role);
  res.status(200).json({
    success: true,
    message: "User role updated successfully",
    data: user,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const deleted = await userService.deleteUser(req.params.id);
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: deleted,
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await userService.getCurrentUser(req.user.id);
  res.status(200).json({
    success: true,
    message: "Current user fetched successfully",
    data: user,
  });
});

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getCurrentUser,
};
