const authService = require('../services/authService');
const { loginSchema, registerSchema } = require('../validations/zodSchemas');

const authController = {
  async login(req, res) {
    try {
      const data = loginSchema.parse(req.body);
      const result = await authService.login(data.username, data.password);
      res.json(result);
    } catch (err) {
      res.status(401).json({ error: err.message || 'Login failed' });
    }
  },

  async register(req, res) {
    try {
      const data = registerSchema.parse(req.body);
      const user = await authService.register(data);
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message || 'Registration failed' });
    }
  },
};

module.exports = authController;
