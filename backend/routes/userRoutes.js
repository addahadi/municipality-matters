const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const userController = require('../controllers/userController');

router.get('/', auth, role('ADMIN'), userController.getAll);
router.get('/:id', auth, role('ADMIN'), userController.getById);
router.put('/:id', auth, role('ADMIN'), userController.update);
router.delete('/:id', auth, role('ADMIN'), userController.delete);

module.exports = router;
