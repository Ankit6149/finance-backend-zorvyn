const usersQueries = require("../db/queries/users.queries");
const { verifyAccessToken } = require("../utils/jwt");
const { ApiError, asyncHandler } = require("../utils/helper");

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication token is missing");
  }

  const token = authHeader.split(" ")[1];

  let decodedToken;
  try {
    decodedToken = verifyAccessToken(token);
  } catch {
    throw new ApiError(401, "Invalid or expired authentication token");
  }

  const user = await usersQueries.getUserById(decodedToken.userId);
  if (!user) {
    throw new ApiError(401, "User for this token no longer exists");
  }

  if (user.status !== "active") {
    throw new ApiError(403, "User account is inactive");
  }

  req.user = {
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
  };

  next();
});

module.exports = authenticate;
