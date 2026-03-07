const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const invoiceController = require('../controllers/invoiceController');

router.get('/', auth, invoiceController.getAll);
router.post('/pay', auth, invoiceController.pay);

module.exports = router;
