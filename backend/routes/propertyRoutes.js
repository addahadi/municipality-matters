const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const validate = require("../middlewares/validate");
const propertyController = require("../controllers/propertyController");
const { propertySchema } = require("../validations/zodSchemas");

const upload = multer({
  dest: "uploads/properties/",
  limits: { fileSize: 20 * 1024 * 1024 },
});
const fields = upload.fields([
  { name: "cahierDeChargePDF", maxCount: 1 },
  { name: "rentalContractPDF", maxCount: 1 },
]);

router.get("/", auth, propertyController.getAll);
router.get("/:id/cahier", auth, propertyController.getCahier);
router.get("/:id", auth, propertyController.getById);
router.post(
  "/",
  auth,
  role("EMPLOYEE", "ADMIN"),
  fields,
  validate(propertySchema),
  propertyController.create,
);
router.put(
  "/:id",
  auth,
  role("EMPLOYEE", "ADMIN"),
  fields,
  validate(propertySchema, { partial: true }),
  propertyController.update,
);
router.delete(
  "/:id",
  auth,
  role("EMPLOYEE", "ADMIN"),
  propertyController.delete,
);

module.exports = router;
