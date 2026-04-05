const { ApiError } = require("../utils/helper");

const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
  }

  if (error.code === "23505") {
    return res.status(409).json({
      success: false,
      message: "Resource already exists",
      details: error.detail || null,
    });
  }

  if (error.code === "23503") {
    return res.status(400).json({
      success: false,
      message: "Invalid reference provided",
      details: error.detail || null,
    });
  }

  console.error("Unhandled error:", error);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
