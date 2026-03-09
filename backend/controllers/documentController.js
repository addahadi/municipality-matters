const citizenDocumentRepository = require("../repositories/citizenDocumentRepository");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinaryUpload");

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

      const uploadResult = await uploadToCloudinary(
        req.file,
        "auto",
        "municipality/documents",
      );

      const doc = await citizenDocumentRepository.create({
        citizenId: req.user.id,
        filePath: uploadResult.secure_url,
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
      // Redirect to Cloudinary URL
      res.redirect(doc.filePath);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const doc = await citizenDocumentRepository.findById(req.params.id);
      if (!doc) return res.status(404).json({ error: "Document not found" });

      // Verify ownership
      if (doc.citizenId !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      // Delete from Cloudinary
      await deleteFromCloudinary(doc.filePath);

      // Delete from database
      await citizenDocumentRepository.delete(req.params.id);
      res.json({ message: "Document deleted successfully" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { documentType } = req.body;
      if (!documentType) {
        return res.status(400).json({ error: "Document type is required" });
      }

      const doc = await citizenDocumentRepository.findById(req.params.id);
      if (!doc) return res.status(404).json({ error: "Document not found" });

      // Verify ownership
      if (doc.citizenId !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const updatedDoc = await citizenDocumentRepository.update(req.params.id, {
        documentType,
      });
      res.json(updatedDoc);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

module.exports = documentController;
