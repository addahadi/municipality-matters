const reviewRepository = require('../repositories/reviewRepository');

const reviewService = {
  getAll: () => reviewRepository.findAll(),
  getByCitizen: (citizenId) => reviewRepository.findByCitizen(citizenId),
  create: (data) => reviewRepository.create(data),
  hide: (id) => reviewRepository.hide(id),
};

module.exports = reviewService;
