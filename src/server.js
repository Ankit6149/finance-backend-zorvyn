const app = require("./app");
const { env } = require("./config/env");

const server = app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});
