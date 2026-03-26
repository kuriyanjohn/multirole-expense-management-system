const Expense = require('../../models/expenseModel');
const User = require('../../models/User');
const Category = require('../../models/category');

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
      const users = await User.find({}, 'name email role team');
  
      const categories = await Category.find();
  
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
        categories,
        monthlyTrend: formattedMonthlyTrend,
      });
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
      res.status(500).json({ message: "Failed to fetch admin dashboard data" });
    }
  };

const exportExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate('createdBy', 'name email role');
    if (!expenses.length) return res.status(404).json({ message: 'No expenses found' });

    const headers = ['ID', 'Date', 'Amount', 'Category', 'Project', 'Status', 'User Name', 'User Email'];
    const rows = expenses.map(e => {
      const date = new Date(e.date).toISOString().split('T')[0];
      const userName = e.createdBy ? e.createdBy.name.replace(/"/g, '""') : 'Unknown';
      const userEmail = e.createdBy ? e.createdBy.email : 'Unknown';
      return `"${e._id}","${date}","${e.amount}","${e.category}","${e.project}","${e.status}","${userName}","${userEmail}"`;
    });

    const csvData = [headers.join(','), ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=expenses.csv');
    res.status(200).send(csvData);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting expenses' });
  }
};

module.exports = { 
    getAllExpenses, 
    manageUsers,
    getAdminDashboardData,
    exportExpenses
 };
