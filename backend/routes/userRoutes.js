const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const userController = require('../controllers/userController');
const validate = require('../middlewares/validate');
const { adminCreateUserSchema } = require('../validations/zodSchemas');

router.get('/', auth, role('ADMIN', 'EMPLOYEE'), userController.getAll);
router.get('/:id', auth, role('ADMIN'), userController.getById);
router.post('/', auth, role('ADMIN'), validate(adminCreateUserSchema), userController.create);
router.put('/:id', auth, role('ADMIN'), userController.update);
router.delete('/:id', auth, role('ADMIN'), userController.delete);

module.exports = router;
