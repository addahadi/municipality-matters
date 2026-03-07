const requestRepository = require('../repositories/requestRepository');

const requestService = {
  getAll: () => requestRepository.findAll(),
  getByCitizen: (citizenId) => requestRepository.findByCitizen(citizenId),
  create: (data) => requestRepository.create(data),
  approve: (id) => requestRepository.updateStatus(id, 'APPROVED'),
  reject: (id) => requestRepository.updateStatus(id, 'REJECTED'),
};

module.exports = requestService;
