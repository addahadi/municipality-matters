const authService = require("../services/authService");

const authController = {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);
      res.json(result);
    } catch (err) {
      res.status(401).json({ error: err.message || "Login failed" });
    }
  },

  async register(req, res) {
    try {
      console.log("nigga are you good?");
      const user = await authService.register(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message || "Registration failed" });
    }
  },
};

module.exports = authController;
