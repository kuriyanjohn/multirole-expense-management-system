// components/AdminDashboard.jsx
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Sidebar from './sidebar';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = ({ data, onLogout }) => {
    console.log('admindata',data);
    
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role="admin" />
      <div className="flex flex-col flex-1">
        <Header onLogout={onLogout} />
        <main className="p-4">
          <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Expenses by Category</h3>
              <PieChart width={300} height={300}>
  {data?.categoryStats && (
    <Pie
      data={data.categoryStats}
      dataKey="value"
      nameKey="category"
      cx="50%"
      cy="50%"
      outerRadius={80}
      fill="#8884d8"
      label
    >
      {data.categoryStats.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
  )}
  <Tooltip />
</PieChart>

            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Expenses by Team</h3>
              {data?.teamStats && (
  <BarChart width={400} height={300} data={data.teamStats}>
    <XAxis dataKey="team" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="amount" fill="#8884d8" />
  </BarChart>
)}

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;