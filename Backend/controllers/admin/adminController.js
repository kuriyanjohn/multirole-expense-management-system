const Expense = require('../../models/expenseModel');
const User = require('../../models/User');

const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate('createdBy', 'name email role');
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving all expenses' });
  }
};

const manageUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving users' });
  }
};
const getAdminDashboardData = async (req, res) => {
    try {
      console.log('admindashboard');
      
      const expenses = await Expense.find().populate('createdBy', 'name email team role');
      const users = await User.find({}, 'name email  role team company');
      const companies = await Company.find({}, 'name monthlyBudget');
  
      const categories = await Expense.distinct("category");
  
      const monthlyTrend = await Expense.aggregate([
        {
          $group: {
            _id: { $month: "$date" },
            amount: { $sum: "$amount" },
          },
        },
        {
          $sort: { _id: 1 }
        }
      ]);


  
      const formattedMonthlyTrend = monthlyTrend.map((item) => ({
        month: new Date(2000, item._id - 1).toLocaleString('default', { month: 'short' }),
        amount: item.amount
      }));
  console.log('monthly trend',formattedMonthlyTrend);
  
      res.status(200).json({
        expenses,
        users,
        companies,
        categories,
        monthlyTrend: formattedMonthlyTrend,
      });
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
      res.status(500).json({ message: "Failed to fetch admin dashboard data" });
    }
  };

module.exports = { 
    getAllExpenses, 
    manageUsers,
    getAdminDashboardData
 };
