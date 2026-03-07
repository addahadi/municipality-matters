const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const complaintController = require('../controllers/complaintController');

router.get('/', auth, complaintController.getAll);
router.post('/', auth, role('CITIZEN'), complaintController.create);
router.put('/:id/resolve', auth, role('EMPLOYEE', 'ADMIN'), complaintController.resolve);

module.exports = router;
