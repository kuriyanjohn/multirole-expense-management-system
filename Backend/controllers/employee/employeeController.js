const Expense = require("../../models/expenseModel");

const addExpense = async (req, res) => {
  try {
    console.log('add expense data',req.body,'user:',req.user);
    const { amount, date, category, project, notes } = req.body;
    const receipt = req.file ? req.file.filename : "";

    const newExpense = new Expense({
      amount,
      date,
      category,
      project,
      notes,
      receipt,
      createdBy: req.user._id, 
    });

    const saved = await newExpense.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
const editExpense = async (req, res) => {
  try {
    console.log('editexpences');
    
    const { id } = req.params;
    const { amount, date, category, project, notes } = req.body;
    const receipt = req.file ? req.file.filename : undefined;

    const updateFields = { amount, date, category, project, notes };
    if (receipt) updateFields.receipt = receipt;

    const updated = await Expense.findOneAndUpdate(
      { _id: id, createdBy: req.user._id, status: 'pending' },
      updateFields,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Expense not found or not editable" });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Delete Expense
const deleteExpense = async (req, res) => {
  try {
    console.log('deleteexpens');
    
    const { id } = req.params;

    const deleted = await Expense.findOneAndDelete({
      _id: id,
      createdBy: req.user._id,
      status: 'pending',
    });

    if (!deleted) return res.status(404).json({ message: "Expense not found or not deletable" });

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getMyExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ createdBy: req.user._id });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving expenses' });
  }
};
const getEmployeeDashboardData = async (req, res) => {
  try {
    const expenses = await Expense.find({ createdBy: req.user._id });

    // Total amount spent
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Pie chart data: total per category
    const categoryMap = {};
    expenses.forEach(exp => {
      categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
    });

    const pieData = Object.entries(categoryMap).map(([name, value], i) => ({
      name,
      value,
      color: `hsl(var(--chart-${(i % 6) + 1}))`, // color cycling
    }));    

    // Bar chart data: total per month
    const monthlyMap = {};
    expenses.forEach(exp => {
      const month = new Date(exp.date).toLocaleString("default", { month: "short" });
      monthlyMap[month] = (monthlyMap[month] || 0) + exp.amount;
    });

    const barData = Object.entries(monthlyMap).map(([name, expense]) => ({
      name,
      expense,
    }));
    

    const recentExpenses = expenses
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      

    res.status(200).json({
      totalSpent,
      expenseCount: expenses.length,
      pieData,
      barData,
      recentExpenses,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};


module.exports = { 
  addExpense, 
  editExpense,
  deleteExpense,
  getMyExpenses ,
  getEmployeeDashboardData
};

