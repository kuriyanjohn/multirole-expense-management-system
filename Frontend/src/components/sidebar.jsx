import React from 'react';

const Sidebar = ({ role }) => {
  const isAdmin = role === 'admin';

  return (
    <aside className="w-64 bg-gray-100 p-4 h-screen border-r">
      <nav className="space-y-2">
        <a href="/dashboard" className="block text-lg">Dashboard</a>
        <a href="/expenses" className="block text-lg">Expenses</a>
        {isAdmin && <a href="/users" className="block text-lg">User Management</a>}
        <a href="/profile" className="block text-lg">Profile</a>
      </nav>
    </aside>
  );
};

export default Sidebar;