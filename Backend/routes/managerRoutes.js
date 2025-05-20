const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const managerController = require('../controllers/manager/managerController');


router.get('/expenses/team',protect,authorizeRoles('manager'), managerController.getTeamExpenses);
router.patch('/expenses/:id/approve',protect,authorizeRoles('manager'),managerController.approveExpense);
router.get('/expenses',protect,authorizeRoles('manager'), managerController.getManagerExpenses);
router.get('/budgets',protect,authorizeRoles('manager'), managerController.getTeamBudgets);
router.get('/notifications',protect,authorizeRoles('manager'),managerController.getManagerNotifications);
router.get('/manager',protect,authorizeRoles('manager'),managerController.getManagerDashboard)

module.exports = router;
