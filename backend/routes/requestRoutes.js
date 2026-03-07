const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const validate = require("../middlewares/validate");
const requestController = require("../controllers/requestController");
const { requestSchema } = require("../validations/zodSchemas");

router.get("/", auth, requestController.getAll);
router.post(
  "/",
  auth,
  role("CITIZEN"),
  validate(requestSchema),
  requestController.create,
);
router.put(
  "/:id/approve",
  auth,
  role("EMPLOYEE", "ADMIN"),
  requestController.approve,
);
router.put(
  "/:id/reject",
  auth,
  role("EMPLOYEE", "ADMIN"),
  requestController.reject,
);

module.exports = router;
