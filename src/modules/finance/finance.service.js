const financeQueries = require("../../db/queries/finance.queries");
const usersQueries = require("../../db/queries/users.queries");
const { ApiError } = require("../../utils/helper");

const createRecord = async (payload) => {
  const user = await usersQueries.getUserById(payload.userId);
  if (!user) {
    throw new ApiError(400, "Invalid userId provided");
  }

  return financeQueries.createRecord(payload);
};

const getRecordById = async (id) => {
  const record = await financeQueries.getRecordById(id);
  if (!record) {
    throw new ApiError(404, "Financial record not found");
  }
  return record;
};

const getRecords = async ({ page, limit, ...filters }) => {
  const offset = (page - 1) * limit;

  const result = await financeQueries.getRecords(filters, { limit, offset });

  return {
    items: result.records,
    pagination: {
      page,
      limit,
      totalItems: result.total,
      totalPages: Math.max(1, Math.ceil(result.total / limit)),
    },
  };
};

const updateRecord = async (id, payload) => {
  if (payload.userId) {
    const user = await usersQueries.getUserById(payload.userId);
    if (!user) {
      throw new ApiError(400, "Invalid userId provided");
    }
  }

  const updatedRecord = await financeQueries.updateRecord(id, payload);
  if (!updatedRecord) {
    throw new ApiError(404, "Financial record not found");
  }

  return updatedRecord;
};

const deleteRecord = async (id) => {
  const deleted = await financeQueries.deleteRecord(id);
  if (!deleted) {
    throw new ApiError(404, "Financial record not found");
  }

  return deleted;
};

module.exports = {
  createRecord,
  getRecordById,
  getRecords,
  updateRecord,
  deleteRecord,
};
