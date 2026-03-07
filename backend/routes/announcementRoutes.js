const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const announcementController = require('../controllers/announcementController');

router.get('/', auth, announcementController.getAll);
router.post('/', auth, role('EMPLOYEE', 'ADMIN'), announcementController.create);
router.put('/:id', auth, role('EMPLOYEE', 'ADMIN'), announcementController.update);

module.exports = router;
