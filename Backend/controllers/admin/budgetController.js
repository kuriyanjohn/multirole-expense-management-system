const TeamBudget = require('../../models/teamBudget');

const getBudgets = async (req, res) => {
  try {
    const budgets = await TeamBudget.find();
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching budgets' });
  }
};

const createOrUpdateBudget = async (req, res) => {
  try {
    const { team, budget } = req.body;
    if (!team || !budget) return res.status(400).json({ message: 'Team and budget are required' });
    
    let teamBudget = await TeamBudget.findOne({ team });
    if (teamBudget) {
      teamBudget.budget = budget;
      teamBudget.remaining = budget - teamBudget.spent;
      await teamBudget.save();
    } else {
      teamBudget = await TeamBudget.create({ team, budget, remaining: budget });
    }
    
    res.json(teamBudget);
  } catch (err) {
    res.status(500).json({ message: 'Error updating budget' });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    await TeamBudget.findByIdAndDelete(id);
    res.json({ message: 'Budget deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting budget' });
  }
};

module.exports = { getBudgets, createOrUpdateBudget, deleteBudget };
