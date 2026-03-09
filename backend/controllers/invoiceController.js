const invoiceService = require("../services/invoiceService");

const invoiceController = {
  async getAll(req, res) {
    try {
      if (req.user.role === "CITIZEN") {
        res.json(await invoiceService.getByCitizen(req.user.id));
      } else {
        res.json(await invoiceService.getAll());
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { propertyId, total, description } = req.body;
      const invoice = await invoiceService.create({
        citizenId: req.user.id,
        propertyId,
        total,
        description,
      });
      res.status(201).json(invoice);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async pay(req, res) {
    try {
      const { invoiceId, amount } = req.body;
      const result = await invoiceService.pay(invoiceId, amount);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

module.exports = invoiceController;
