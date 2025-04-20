const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const managerController = require('../controllers/manager/managerController');

router.use(protect);
router.use(authorizeRoles('manager'));

router.get('/expenses/team', managerController.getTeamExpenses);
router.patch('/expenses/:id/approve',managerController.approveExpense);
router.get('/expenses', managerController.getManagerExpenses);
router.get('/budgets', managerController.getTeamBudgets);
router.get('/notifications',managerController.getManagerNotifications);
router.get('/manager',managerController.getManagerDashboard)

module.exports = router;
