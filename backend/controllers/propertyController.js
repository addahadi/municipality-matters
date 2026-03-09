const propertyService = require("../services/propertyService");
const cahierRepository = require("../repositories/cahierRepository");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");

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
      if (!property) return res.status(404).json({ error: "Not found" });
      res.json(property);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const data = req.body;

      if (req.files?.cahierDeChargePDF?.[0]) {
        const uploadResult = await uploadToCloudinary(
          req.files.cahierDeChargePDF[0],
          "auto",
          "municipality/properties/cahier",
        );
        data.cahierDeChargePDF = uploadResult.secure_url;
      }

      if (req.files?.rentalContractPDF?.[0]) {
        const uploadResult = await uploadToCloudinary(
          req.files.rentalContractPDF[0],
          "auto",
          "municipality/properties/rental",
        );
        data.rentalContractPDF = uploadResult.secure_url;
      }

      const property = await propertyService.create(data);
      res.status(201).json(property);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const data = req.body;

      if (req.files?.cahierDeChargePDF?.[0]) {
        const uploadResult = await uploadToCloudinary(
          req.files.cahierDeChargePDF[0],
          "auto",
          "municipality/properties/cahier",
        );
        data.cahierDeChargePDF = uploadResult.secure_url;
      }

      if (req.files?.rentalContractPDF?.[0]) {
        const uploadResult = await uploadToCloudinary(
          req.files.rentalContractPDF[0],
          "auto",
          "municipality/properties/rental",
        );
        data.rentalContractPDF = uploadResult.secure_url;
      }

      const property = await propertyService.update(req.params.id, data);
      res.json(property);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      await propertyService.delete(req.params.id);
      res.json({ message: "Deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getCahier(req, res) {
    try {
      const property = await propertyService.getById(req.params.id);
      if (!property || !property.cahierDeChargePDF) {
        return res.status(404).json({ error: "PDF not found" });
      }

      // Check if citizen has purchased cahier
      const hasPurchased = await cahierRepository.hasPurchased(
        req.user.id,
        req.params.id,
      );

      if (req.user.role === "CITIZEN" && !hasPurchased) {
        return res.status(403).json({
          error: "Access denied",
          message: "You must purchase this cahier de charge to access it",
          requiresPayment: true,
          cahierPrice: property.cahierPrice,
          purchaseStatus: {
            hasPurchased,
            userId: req.user.id,
            propertyId: req.params.id,
          },
        });
      }

      // Return Cloudinary URL
      res.json({ url: property.cahierDeChargePDF });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async purchaseCahier(req, res) {
    try {
      const property = await propertyService.getById(req.params.id);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }

      if (!property.cahierDeChargePDF) {
        return res.status(400).json({ error: "This property has no cahier" });
      }

      // Record purchase
      const purchase = await cahierRepository.purchase(
        req.user.id,
        req.params.id,
      );

      if (!purchase) {
        // Already purchased
        return res.json({
          message: "Already purchased",
          propertyId: req.params.id,
        });
      }

      res.status(201).json({
        message: "Cahier purchased successfully",
        purchase,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getMyPurchases(req, res) {
    try {
      const purchases = await cahierRepository.getPurchasesByCitizen(
        req.user.id,
      );
      res.json(purchases);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = propertyController;
