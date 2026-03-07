const validate =
  (schema, options = {}) =>
  (req, res, next) => {
    try {
      const validationSchema = options.partial ? schema.partial() : schema;
      req.body = validationSchema.parse(req.body);
      next();
    } catch (err) {
      res.status(400).json({
        error: "Validation failed",
        details: err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }
  };

module.exports = validate;
