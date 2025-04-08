import React from 'react';

const Dashboard = ({ user }) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Welcome, {user.name}</h2>
      <p className="text-gray-600">You are logged in as a <strong>{user.role}</strong>.</p>
    </div>
  );
};

export default Dashboard;
