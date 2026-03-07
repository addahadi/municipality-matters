const auctionService = require("../services/auctionService");

const auctionController = {
  async getAll(req, res) {
    try {
      res.json(await auctionService.getAll());
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const data = req.body;
      res.status(201).json(await auctionService.create(data));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async placeBid(req, res) {
    try {
      const { amount } = req.body;
      const bid = await auctionService.placeBid(
        req.params.id,
        req.user.id,
        amount,
      );
      res.status(201).json(bid);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async close(req, res) {
    try {
      res.json(await auctionService.close(req.params.id));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

module.exports = auctionController;
