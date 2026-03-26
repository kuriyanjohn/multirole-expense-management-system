const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const budgetController = require('../controllers/admin/budgetController');

router.get('/', protect, authorizeRoles('admin', 'manager'), budgetController.getBudgets);
router.post('/', protect, authorizeRoles('admin', 'manager'), budgetController.createOrUpdateBudget);
router.delete('/:id', protect, authorizeRoles('admin'), budgetController.deleteBudget);

module.exports = router;
