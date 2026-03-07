const propertyService = require('../services/propertyService');

const statisticsController = {
  async getPropertyStats(req, res) {
    try {
      res.json(await propertyService.getStats());
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = statisticsController;
