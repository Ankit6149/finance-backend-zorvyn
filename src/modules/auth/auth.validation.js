const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(100),
  password: z.string().min(8).max(72),
  role: z.enum(["admin", "analyst", "viewer"]).optional().default("viewer"),
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

module.exports = {
  registerSchema,
  loginSchema,
};
