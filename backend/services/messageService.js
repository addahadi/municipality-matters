const messageRepository = require('../repositories/messageRepository');

const messageService = {
  getByUser: (userId) => messageRepository.findByUser(userId),
  send: (data) => messageRepository.create(data),
  markAsRead: (id) => messageRepository.markAsRead(id),
};

module.exports = messageService;
