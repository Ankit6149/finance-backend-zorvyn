const { ZodError } = require("zod");
const { ApiError } = require("../utils/helper");

const validate = (schema, source = "body") => (req, res, next) => {
  try {
    req[source] = schema.parse(req[source]);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return next(
        new ApiError(400, "Validation failed", {
          fieldErrors: error.flatten().fieldErrors,
        }),
      );
    }

    return next(error);
  }
};

module.exports = validate;
