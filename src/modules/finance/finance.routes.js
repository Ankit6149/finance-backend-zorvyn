const express = require("express");
const controller = require("./finance.controller");
const authenticate = require("../../middlewares/auth.middleware");
const authorizeRoles = require("../../middlewares/role.middleware");
const validate = require("../../middlewares/validate.middleware");
const {
  createRecordSchema,
  updateRecordSchema,
  listRecordsQuerySchema,
  recordIdParamSchema,
} = require("./finance.validation");

const router = express.Router();

router.use(authenticate);

router.get(
  "/",
  authorizeRoles("admin", "analyst"),
  validate(listRecordsQuerySchema, "query"),
  controller.getRecords,
);

router.get(
  "/:id",
  authorizeRoles("admin", "analyst"),
  validate(recordIdParamSchema, "params"),
  controller.getRecordById,
);

router.post(
  "/",
  authorizeRoles("admin"),
  validate(createRecordSchema),
  controller.createRecord,
);

router.put(
  "/:id",
  authorizeRoles("admin"),
  validate(recordIdParamSchema, "params"),
  validate(updateRecordSchema),
  controller.updateRecord,
);

router.delete(
  "/:id",
  authorizeRoles("admin"),
  validate(recordIdParamSchema, "params"),
  controller.deleteRecord,
);

module.exports = router;
