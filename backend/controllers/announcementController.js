const announcementService = require("../services/announcementService");

const announcementController = {
  async getAll(req, res) {
    try {
      res.json(await announcementService.getAll());
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const data = req.body;
      res.status(201).json(await announcementService.create(data));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const data = req.body;
      res.json(await announcementService.update(req.params.id, data));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

module.exports = announcementController;
