const mongoose = require('mongoose');

const teamBudgetSchema = new mongoose.Schema({
  team: { type: String, required: true },
  budget: { type: Number, required: true },
  spent: { type: Number, default: 0 },
  remaining: { type: Number, default: 0 },
});

module.exports = mongoose.model('TeamBudget', teamBudgetSchema);
