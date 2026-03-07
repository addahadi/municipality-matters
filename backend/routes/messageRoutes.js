const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const validate = require("../middlewares/validate");
const messageController = require("../controllers/messageController");
const { messageSchema } = require("../validations/zodSchemas");

router.get("/", auth, role("EMPLOYEE", "ADMIN"), messageController.getAll);
router.post(
  "/",
  auth,
  role("EMPLOYEE", "ADMIN"),
  validate(messageSchema),
  messageController.send,
);
router.put("/:id/read", auth, messageController.markAsRead);

module.exports = router;
