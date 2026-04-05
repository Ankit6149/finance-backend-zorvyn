const express = require("express");
const authRoutes = require("../modules/auth/auth.routes");
const userRoutes = require("../modules/user/user.routes");
const financeRoutes = require("../modules/finance/finance.routes");
const dashboardRoutes = require("../modules/dashboard/dashboard.routes");

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Finance backend is healthy",
    data: {
      timestamp: new Date().toISOString(),
    },
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/finance", financeRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
