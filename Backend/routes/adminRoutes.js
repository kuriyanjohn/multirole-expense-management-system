const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const adminController = require('../controllers/admin/adminController');

router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/expenses/all', adminController.getAllExpenses);
router.get('/users', adminController.manageUsers);
router.get('/dashboard', adminController.getAdminDashboardData);


module.exports = router;
