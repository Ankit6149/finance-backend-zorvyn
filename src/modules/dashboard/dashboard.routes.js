const express = require("express");
const controller = require("./dashboard.controller");
const authenticate = require("../../middlewares/auth.middleware");
const authorizeRoles = require("../../middlewares/role.middleware");
const validate = require("../../middlewares/validate.middleware");
const {
  dashboardFilterQuerySchema,
  recentActivityQuerySchema,
} = require("./dashboard.validation");

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles("admin", "analyst", "viewer"));

router.get(
  "/summary",
  validate(dashboardFilterQuerySchema, "query"),
  controller.getSummary,
);

router.get(
  "/category-totals",
  validate(dashboardFilterQuerySchema, "query"),
  controller.getCategoryTotals,
);

router.get(
  "/recent-activity",
  validate(recentActivityQuerySchema, "query"),
  controller.getRecentActivity,
);

router.get(
  "/monthly-trends",
  validate(dashboardFilterQuerySchema, "query"),
  controller.getMonthlyTrends,
);

module.exports = router;
