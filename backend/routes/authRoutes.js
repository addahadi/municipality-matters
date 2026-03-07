const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const validate = require("../middlewares/validate");
const { loginSchema, registerSchema } = require("../validations/zodSchemas");

router.post("/login", validate(loginSchema), authController.login);
router.post("/register", validate(registerSchema), authController.register);

module.exports = router;
