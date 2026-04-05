const { z } = require("zod");

const uuidSchema = z.string().uuid();
const roleSchema = z.enum(["admin", "analyst", "viewer"]);

const createUserSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(100),
  password: z.string().min(8).max(72),
  role: roleSchema.default("viewer"),
  status: z.enum(["active", "inactive"]).optional().default("active"),
});

const updateUserStatusSchema = z.object({
  status: z.enum(["active", "inactive"]),
});

const updateUserRoleSchema = z.object({
  role: roleSchema,
});

const userIdParamSchema = z.object({
  id: uuidSchema,
});

const listUsersQuerySchema = z.object({
  status: z.enum(["active", "inactive"]).optional(),
  role: roleSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

module.exports = {
  createUserSchema,
  updateUserStatusSchema,
  updateUserRoleSchema,
  userIdParamSchema,
  listUsersQuerySchema,
};
