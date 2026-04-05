const { z } = require("zod");

const uuidSchema = z.string().uuid();

const dashboardFilterQuerySchema = z.object({
  userId: uuidSchema.optional(),
  type: z.enum(["income", "expense"]).optional(),
  category: z.string().trim().min(1).max(50).optional(),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
});

const recentActivityQuerySchema = dashboardFilterQuerySchema.extend({
  limit: z.coerce.number().int().positive().max(100).default(5),
});

module.exports = {
  dashboardFilterQuerySchema,
  recentActivityQuerySchema,
};
