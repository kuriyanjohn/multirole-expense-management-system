import React from 'react';
import Sidebar from './sidebar';
import Header from './Header';

const ManagerDashboard = ({ teamExpenses, onLogout }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role="manager" />
      <div className="flex flex-col flex-1">
        <Header onLogout={onLogout} />
        <main className="p-4">
          <h2 className="text-2xl font-bold mb-4">Manager Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.isArray(teamExpenses) && teamExpenses.length > 0 ? (
  teamExpenses.map((expense, index) => (
    <div key={index} className="bg-white p-4 rounded shadow">
      <h4 className="font-semibold">{expense.employee}</h4>
      <p>Amount: ₹{expense.amount}</p>
      <p>Date: {expense.date}</p>
      <p>Status: {expense.status}</p>
    </div>
  ))
) : (
  <p>No team expenses to display.</p>
)}

          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;