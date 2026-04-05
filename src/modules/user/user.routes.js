const express = require("express");
const controller = require("./user.controller");
const authenticate = require("../../middlewares/auth.middleware");
const authorizeRoles = require("../../middlewares/role.middleware");
const validate = require("../../middlewares/validate.middleware");
const {
  createUserSchema,
  updateUserStatusSchema,
  updateUserRoleSchema,
  userIdParamSchema,
  listUsersQuerySchema,
} = require("./user.validation");

const router = express.Router();

router.use(authenticate);

router.get("/me", controller.getCurrentUser);

router.post(
  "/",
  authorizeRoles("admin"),
  validate(createUserSchema),
  controller.createUser,
);

router.get(
  "/",
  authorizeRoles("admin"),
  validate(listUsersQuerySchema, "query"),
  controller.getAllUsers,
);

router.get(
  "/:id",
  authorizeRoles("admin"),
  validate(userIdParamSchema, "params"),
  controller.getUserById,
);

router.patch(
  "/:id/status",
  authorizeRoles("admin"),
  validate(userIdParamSchema, "params"),
  validate(updateUserStatusSchema),
  controller.updateUserStatus,
);

router.patch(
  "/:id/role",
  authorizeRoles("admin"),
  validate(userIdParamSchema, "params"),
  validate(updateUserRoleSchema),
  controller.updateUserRole,
);

router.delete(
  "/:id",
  authorizeRoles("admin"),
  validate(userIdParamSchema, "params"),
  controller.deleteUser,
);

module.exports = router;
