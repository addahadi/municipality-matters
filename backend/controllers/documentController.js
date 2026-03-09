const citizenDocumentRepository = require("../repositories/citizenDocumentRepository");
const path = require("path");

const documentController = {
  async getByCitizen(req, res) {
    try {
      res.json(await citizenDocumentRepository.findByCitizen(req.user.id));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async upload(req, res) {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });
      const { documentType = "RESIDENCE_CERTIFICATE" } = req.body;
      const doc = await citizenDocumentRepository.create({
        citizenId: req.user.id,
        filePath: req.file.path,
        documentType,
      });
      res.status(201).json(doc);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async download(req, res) {
    try {
      const docs = await citizenDocumentRepository.findByCitizen(req.user.id);
      const doc = docs.find((d) => d.id === req.params.id);
      if (!doc) return res.status(404).json({ error: "Document not found" });
      res.download(path.resolve(doc.filePath));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = documentController;
