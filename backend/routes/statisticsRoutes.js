const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const statisticsController = require('../controllers/statisticsController');

router.get('/properties', auth, role('ADMIN'), statisticsController.getPropertyStats);

module.exports = router;
