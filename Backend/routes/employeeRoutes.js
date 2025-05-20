const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const employeeController= require('../controllers/employee/employeeController');
const upload = require('../middlewares/uploadMiddleware');


router.post('/expenses', upload.single('receipt'),protect,authorizeRoles('employee'), employeeController.addExpense);
router.put('/expenses/:id', upload.single('receipt'),protect,authorizeRoles('employee'), employeeController.editExpense);
router.delete('/expenses/:id',protect,authorizeRoles('employee'), employeeController.deleteExpense); 
router.get('/expenses',protect,authorizeRoles('employee'), employeeController.getMyExpenses);
router.get('/dashboard',protect,authorizeRoles('employee'),employeeController.getEmployeeDashboardData)

module.exports = router;
