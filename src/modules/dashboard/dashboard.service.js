const dashboardQueries = require("../../db/queries/dashboard.queries");

const getSummary = async (filters) => dashboardQueries.getSummary(filters);

const getCategoryTotals = async (filters) =>
  dashboardQueries.getCategoryTotals(filters);

const getRecentActivity = async ({ limit, ...filters }) =>
  dashboardQueries.getRecentActivity(filters, limit);

const getMonthlyTrends = async (filters) =>
  dashboardQueries.getMonthlyTrends(filters);

module.exports = {
  getSummary,
  getCategoryTotals,
  getRecentActivity,
  getMonthlyTrends,
};
