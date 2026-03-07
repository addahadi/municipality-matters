const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const auctionController = require('../controllers/auctionController');

router.get('/', auth, auctionController.getAll);
router.post('/', auth, role('EMPLOYEE', 'ADMIN'), auctionController.create);
router.post('/:id/bid', auth, role('CITIZEN'), auctionController.placeBid);
router.post('/:id/close', auth, role('EMPLOYEE', 'ADMIN'), auctionController.close);

module.exports = router;
