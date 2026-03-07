const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const validate = require("../middlewares/validate");
const announcementController = require("../controllers/announcementController");
const { announcementSchema } = require("../validations/zodSchemas");

router.get("/", auth, announcementController.getAll);
router.post(
  "/",
  auth,
  role("EMPLOYEE", "ADMIN"),
  validate(announcementSchema),
  announcementController.create,
);
router.put(
  "/:id",
  auth,
  role("EMPLOYEE", "ADMIN"),
  validate(announcementSchema, { partial: true }),
  announcementController.update,
);

module.exports = router;
