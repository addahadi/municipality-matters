const complaintRepository = require('../repositories/complaintRepository');

const complaintService = {
  getAll: () => complaintRepository.findAll(),
  getByCitizen: (citizenId) => complaintRepository.findByCitizen(citizenId),
  create: (data) => complaintRepository.create(data),
  resolve: (id) => complaintRepository.resolve(id),
};

module.exports = complaintService;
