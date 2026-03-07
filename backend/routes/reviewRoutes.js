const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const reviewController = require('../controllers/reviewController');

router.get('/', auth, reviewController.getAll);
router.post('/', auth, role('CITIZEN'), reviewController.create);
router.put('/:id/hide', auth, role('EMPLOYEE', 'ADMIN'), reviewController.hide);

module.exports = router;
