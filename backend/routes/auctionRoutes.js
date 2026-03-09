const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const validate = require("../middlewares/validate");
const auctionController = require("../controllers/auctionController");
const { auctionSchema, bidSchema } = require("../validations/zodSchemas");

router.get("/", auth, auctionController.getAll);
router.get("/:id/bids", auth, role("EMPLOYEE", "ADMIN"), auctionController.getBids);
router.post(
  "/",
  auth,
  role("EMPLOYEE", "ADMIN"),
  validate(auctionSchema),
  auctionController.create,
);
router.post(
  "/:id/bid",
  auth,
  role("CITIZEN"),
  validate(bidSchema),
  auctionController.placeBid,
);
router.post(
  "/:id/close",
  auth,
  role("EMPLOYEE", "ADMIN"),
  auctionController.close,
);

module.exports = router;
