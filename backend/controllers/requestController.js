const requestService = require("../services/requestService");

const requestController = {
  async getAll(req, res) {
    try {
      if (req.user.role === "CITIZEN") {
        res.json(await requestService.getByCitizen(req.user.id));
      } else {
        res.json(await requestService.getAll());
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const data = req.body;
      res
        .status(201)
        .json(await requestService.create({ citizenId: req.user.id, ...data }));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async approve(req, res) {
    try {
      res.json(await requestService.approve(req.params.id));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async reject(req, res) {
    try {
      res.json(await requestService.reject(req.params.id));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

module.exports = requestController;
