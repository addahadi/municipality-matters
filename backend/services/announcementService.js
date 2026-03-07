const announcementRepository = require('../repositories/announcementRepository');

const announcementService = {
  getAll: () => announcementRepository.findAll(),
  create: (data) => announcementRepository.create(data),
  update: (id, data) => announcementRepository.update(id, data),
};

module.exports = announcementService;
