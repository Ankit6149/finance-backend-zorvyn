const { z } = require("zod");

const uuidSchema = z.string().uuid();

const createRecordSchema = z.object({
  userId: uuidSchema,
  amount: z.coerce.number().nonnegative(),
  type: z.enum(["income", "expense"]),
  category: z.string().trim().min(1).max(50),
  note: z.string().trim().max(300).optional().nullable().default(null),
  date: z.string().date(),
});

const updateRecordSchema = z
  .object({
    userId: uuidSchema.optional(),
    amount: z.coerce.number().nonnegative().optional(),
    type: z.enum(["income", "expense"]).optional(),
    category: z.string().trim().min(1).max(50).optional(),
    note: z.string().trim().max(300).optional().nullable(),
    date: z.string().date().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required for update",
  });

const listRecordsQuerySchema = z.object({
  userId: uuidSchema.optional(),
  type: z.enum(["income", "expense"]).optional(),
  category: z.string().trim().min(1).max(50).optional(),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

const recordIdParamSchema = z.object({
  id: uuidSchema,
});

module.exports = {
  createRecordSchema,
  updateRecordSchema,
  listRecordsQuerySchema,
  recordIdParamSchema,
};
