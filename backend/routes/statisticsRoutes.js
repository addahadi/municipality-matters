const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const statisticsController = require("../controllers/statisticsController");

router.get("/admin", auth, role("ADMIN"), statisticsController.getAdminStats);
router.get(
  "/employee",
  auth,
  role("EMPLOYEE", "ADMIN"),
  statisticsController.getEmployeeStats,
);
router.get(
  "/citizen",
  auth,
  role("CITIZEN"),
  statisticsController.getCitizenStats,
);
router.get(
  "/recent-activity",
  auth,
  role("ADMIN"),
  statisticsController.getRecentActivity,
);

module.exports = router;
