import React from 'react';

const ExpenseList = ({ expenses }) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Expense History</h2>
      <ul className="space-y-2">
        {expenses.map((expense, index) => (
          <li key={index} className="border p-3 rounded shadow-sm">
            <div className="flex justify-between">
              <span>{expense.description}</span>
              <span className="text-red-500">₹{expense.amount}</span>
            </div>
            <div className="text-sm text-gray-500">{expense.date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;
