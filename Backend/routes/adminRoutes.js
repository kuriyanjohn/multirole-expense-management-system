const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const adminController = require('../controllers/admin/adminController');

router.get('/expenses/all',protect,authorizeRoles('admin'), adminController.getAllExpenses);
router.get('/users',protect,authorizeRoles('admin'), adminController.manageUsers);
router.get('/admin',protect,authorizeRoles('admin'), adminController.getAdminDashboardData);


module.exports = router;
