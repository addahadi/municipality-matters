const messageService = require('../services/messageService');
const { messageSchema } = require('../validations/zodSchemas');

const messageController = {
  async getAll(req, res) {
    try {
      res.json(await messageService.getByUser(req.user.id));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async send(req, res) {
    try {
      const data = messageSchema.parse(req.body);
      res.status(201).json(await messageService.send({ senderId: req.user.id, ...data }));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async markAsRead(req, res) {
    try {
      res.json(await messageService.markAsRead(req.params.id));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

module.exports = messageController;
