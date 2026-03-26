const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const categoryController = require('../controllers/admin/categoryController');

router.get('/', protect, categoryController.getCategories);
router.post('/', protect, authorizeRoles('admin'), categoryController.createCategory);
router.delete('/:id', protect, authorizeRoles('admin'), categoryController.deleteCategory);

module.exports = router;
