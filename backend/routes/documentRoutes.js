const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const documentController = require('../controllers/documentController');

const upload = multer({ dest: 'uploads/documents/', limits: { fileSize: 20 * 1024 * 1024 } });

router.get('/', auth, role('CITIZEN'), documentController.getByCitizen);
router.post('/', auth, role('CITIZEN'), upload.single('file'), documentController.upload);
router.get('/:id/download', auth, role('CITIZEN'), documentController.download);

module.exports = router;
