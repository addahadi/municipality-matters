const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const invoiceController = require("../controllers/invoiceController");
const { paymentSchema } = require("../validations/zodSchemas");

router.get("/", auth, invoiceController.getAll);
router.post("/pay", auth, validate(paymentSchema), invoiceController.pay);

module.exports = router;
