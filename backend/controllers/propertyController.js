const propertyService = require('../services/propertyService');
const { propertySchema } = require('../validations/zodSchemas');

const propertyController = {
  async getAll(req, res) {
    try {
      const properties = await propertyService.getAll();
      res.json(properties);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const property = await propertyService.getById(req.params.id);
      if (!property) return res.status(404).json({ error: 'Not found' });
      res.json(property);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const data = propertySchema.parse(req.body);
      data.cahierDeChargePDF = req.files?.cahierDeChargePDF?.[0]?.path;
      data.rentalContractPDF = req.files?.rentalContractPDF?.[0]?.path;
      const property = await propertyService.create(data);
      res.status(201).json(property);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const data = propertySchema.partial().parse(req.body);
      if (req.files?.cahierDeChargePDF) data.cahierDeChargePDF = req.files.cahierDeChargePDF[0].path;
      if (req.files?.rentalContractPDF) data.rentalContractPDF = req.files.rentalContractPDF[0].path;
      const property = await propertyService.update(req.params.id, data);
      res.json(property);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      await propertyService.delete(req.params.id);
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = propertyController;
