const { ApiError } = require("../utils/helper");

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, "Authentication is required"));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(
      new ApiError(
        403,
        `Access denied. Allowed roles: ${allowedRoles.join(", ")}`,
      ),
    );
  }

  return next();
};

module.exports = authorizeRoles;
