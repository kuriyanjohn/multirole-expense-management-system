const Expense = require('../../models/expenseModel');
const  TeamBudget=require('../../models/teamBudget')
const User = require('../../models/User');



const getTeamExpenses = async (req, res) => {
  // You can extend this based on your logic of assigning employees to managers
  try {
    const expenses = await Expense.find(); // Filter by manager's team
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving team expenses' });
  }
};

const approveExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Error approving expense' });
  }
};
const getManagerExpenses = async (req, res) => {
    try {
      const managerId = req.user.id;
      const manager = await User.findById(managerId);
  
      const expenses = await Expense.find({ team: manager.team });
      res.json(expenses);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch expenses' });
    }
  };
  const getTeamBudgets = async (req, res) => {
    try {
      const manager = await User.findById(req.user.id);
      const budgets = await TeamBudget.find({ team: manager.team });
      res.json(budgets);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch team budgets' });
    }
  };
  const getManagerNotifications = async (req, res) => {
    try {
      const notifications = await Notification.find({ role: 'manager' });
      res.json(notifications);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  };
  const getManagerDashboard = async (req, res) => {
    try {
      const managerId = req.user.id;
      const manager = await User.findById(managerId).select('-password');
  
      if (!manager || manager.role !== 'manager') {
        return res.status(403).json({ error: 'Access denied. Not a manager.' });
      }
  
      const team = manager.team;
  
      // Fetch data
      const expenses = await Expense.find({ team });
      const teamBudgets = await TeamBudget.find({ team });
      const notifications = await Notification.find({ role: 'manager' });
      const users = await User.find({ team }).select('-password');
      const categories = await Category.find();
      let selectedExpense = null;
      let selectedBudget = null;
      if (selectedExpenseId) {
        selectedExpense = await Expense.findById(selectedExpenseId);
      }
      
    if (selectedBudgetId) {
      selectedBudget = await TeamBudget.findById(selectedBudgetId);
    }
  
      res.status(200).json({
        user: manager,
        users,
        expenses,
        teamBudgets,
        notifications,
        categories,
        selectedExpense,
        selectedBudget
      });
  
    } catch (error) {
      console.error('Manager Dashboard Error:', error);
      res.status(500).json({ error: 'Failed to load manager dashboard data' });
    }
  };
module.exports = { 
    getTeamExpenses, 
    approveExpense,
    getManagerExpenses,
    getManagerNotifications,
    getTeamBudgets ,
    getManagerDashboard
};
