const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const validate = require("../middlewares/validate");
const reviewController = require("../controllers/reviewController");
const { reviewSchema } = require("../validations/zodSchemas");

router.get("/", auth, reviewController.getAll);
router.post(
  "/",
  auth,
  role("CITIZEN"),
  validate(reviewSchema),
  reviewController.create,
);
router.put("/:id/hide", auth, role("EMPLOYEE", "ADMIN"), reviewController.hide);

module.exports = router;
