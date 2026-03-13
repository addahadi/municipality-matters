const propertyRepository = require('../repositories/propertyRepository');

const propertyService = {
  getAll: () => propertyRepository.findAll(),
  getById: (id) => propertyRepository.findById(id),
  create: (data) => propertyRepository.create(data),
  update: (id, data) => propertyRepository.update(id, data),
  delete: (id) => propertyRepository.delete(id),
  getStats: () => propertyRepository.getStats(),
  getByTenant: (tenantId) => propertyRepository.findByTenant(tenantId),
};

module.exports = propertyService;
