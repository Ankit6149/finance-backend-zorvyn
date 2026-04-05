const dashboardService = require("./dashboard.service");
const { asyncHandler } = require("../../utils/helper");

const getSummary = asyncHandler(async (req, res) => {
  const data = await dashboardService.getSummary(req.query);
  res.status(200).json({
    success: true,
    message: "Dashboard summary fetched successfully",
    data,
  });
});

const getCategoryTotals = asyncHandler(async (req, res) => {
  const data = await dashboardService.getCategoryTotals(req.query);
  res.status(200).json({
    success: true,
    message: "Category totals fetched successfully",
    data,
  });
});

const getRecentActivity = asyncHandler(async (req, res) => {
  const data = await dashboardService.getRecentActivity(req.query);
  res.status(200).json({
    success: true,
    message: "Recent activity fetched successfully",
    data,
  });
});

const getMonthlyTrends = asyncHandler(async (req, res) => {
  const data = await dashboardService.getMonthlyTrends(req.query);
  res.status(200).json({
    success: true,
    message: "Monthly trends fetched successfully",
    data,
  });
});

module.exports = {
  getSummary,
  getCategoryTotals,
  getRecentActivity,
  getMonthlyTrends,
};
