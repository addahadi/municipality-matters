const complaintService = require("../services/complaintService");

const complaintController = {
  async getAll(req, res) {
    try {
      if (req.user.role === "CITIZEN") {
        res.json(await complaintService.getByCitizen(req.user.id));
      } else {
        res.json(await complaintService.getAll());
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
        .json(
          await complaintService.create({ citizenId: req.user.id, ...data }),
        );
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async resolve(req, res) {
    try {
      res.json(await complaintService.resolve(req.params.id));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

module.exports = complaintController;
