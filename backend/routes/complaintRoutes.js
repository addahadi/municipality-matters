const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const validate = require("../middlewares/validate");
const complaintController = require("../controllers/complaintController");
const { complaintSchema } = require("../validations/zodSchemas");

router.get("/", auth, complaintController.getAll);
router.post(
  "/",
  auth,
  role("CITIZEN"),
  validate(complaintSchema),
  complaintController.create,
);
router.put(
  "/:id/resolve",
  auth,
  role("EMPLOYEE", "ADMIN"),
  complaintController.resolve,
);

module.exports = router;
