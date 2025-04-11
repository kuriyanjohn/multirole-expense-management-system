const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const employeeController= require('../controllers/employee/employeeController');
const upload = require('../middlewares/uploadMiddleware');


router.use(protect);
router.use((req, res, next) => {
    console.log('👤 User in route:', req.user);
    next();
  });
router.use(authorizeRoles('employee'));

router.post('/expenses', upload.single('receipt'), employeeController.addExpense);
router.put('/expenses/:id', upload.single('receipt'), employeeController.editExpense);
router.delete('/expenses/:id', employeeController.deleteExpense); 
router.get('/expenses', employeeController.getMyExpenses);
router.get('/dashboard',employeeController.getEmployeeDashboardData)

module.exports = router;
