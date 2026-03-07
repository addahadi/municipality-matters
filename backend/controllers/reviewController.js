const reviewService = require("../services/reviewService");

const reviewController = {
  async getAll(req, res) {
    try {
      if (req.user.role === "CITIZEN") {
        res.json(await reviewService.getByCitizen(req.user.id));
      } else {
        res.json(await reviewService.getAll());
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
        .json(await reviewService.create({ citizenId: req.user.id, ...data }));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async hide(req, res) {
    try {
      res.json(await reviewService.hide(req.params.id));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

module.exports = reviewController;
