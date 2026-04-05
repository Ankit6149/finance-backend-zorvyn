const financeService = require("./finance.service");
const { asyncHandler } = require("../../utils/helper");

const createRecord = asyncHandler(async (req, res) => {
  const record = await financeService.createRecord(req.body);
  res.status(201).json({
    success: true,
    message: "Financial record created successfully",
    data: record,
  });
});

const getRecords = asyncHandler(async (req, res) => {
  const records = await financeService.getRecords(req.query);
  res.status(200).json({
    success: true,
    message: "Financial records fetched successfully",
    data: records,
  });
});

const getRecordById = asyncHandler(async (req, res) => {
  const record = await financeService.getRecordById(req.params.id);
  res.status(200).json({
    success: true,
    message: "Financial record fetched successfully",
    data: record,
  });
});

const updateRecord = asyncHandler(async (req, res) => {
  const record = await financeService.updateRecord(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: "Financial record updated successfully",
    data: record,
  });
});

const deleteRecord = asyncHandler(async (req, res) => {
  const result = await financeService.deleteRecord(req.params.id);
  res.status(200).json({
    success: true,
    message: "Financial record deleted successfully",
    data: result,
  });
});

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};
