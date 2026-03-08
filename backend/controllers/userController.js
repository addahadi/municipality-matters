const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');

const userController = {
  async getAll(req, res) {
    try {
      res.json(await userRepository.findAll());
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const user = await userRepository.findById(req.params.id);
      if (!user) return res.status(404).json({ error: 'Not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { username, nationalId, password, role } = req.body;
      const existing = await userRepository.findByUsername(username);
      if (existing) return res.status(400).json({ error: 'Username already exists' });
      const hashed = await bcrypt.hash(password, 10);
      const user = await userRepository.create({ username, nationalId, password: hashed, role: role || 'CITIZEN' });
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      res.json(await userRepository.update(req.params.id, req.body));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      await userRepository.delete(req.params.id);
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = userController;
