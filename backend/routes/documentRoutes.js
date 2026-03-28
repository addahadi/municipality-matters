const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const documentController = require("../controllers/documentController");

// Store uploads in memory (buffer) instead of disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

router.get("/", auth, role("CITIZEN"), documentController.getByCitizen);
router.get("/all", auth, role("EMPLOYEE"), documentController.getAll);
router.post(
  "/",
  auth,
  role("CITIZEN"),
  upload.single("file"),
  documentController.upload,
);
router.get("/:id/download", auth, role("CITIZEN", "EMPLOYEE"), documentController.download);
router.put("/:id", auth, role("CITIZEN"), documentController.update);
router.delete("/:id", auth, role("CITIZEN"), documentController.delete);

module.exports = router;
