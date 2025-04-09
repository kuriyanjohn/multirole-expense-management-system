import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ role }) => {
  const links = {
    admin: ['/admin', '/budgets', '/reports'],
    manager: ['/manager', '/team-expenses', '/reports'],
    employee: ['/employee', '/my-expenses'],
  };

  return (
    <aside className="bg-gray-800 text-white w-64 h-full p-4 space-y-4">
      <h2 className="text-lg font-semibold mb-4">Menu</h2>
      {links[role]?.map((path, index) => (
        <Link
          key={index}
          to={path}
          className="block py-2 px-4 rounded hover:bg-gray-700"
        >
          {path.replace('/', '').replace('-', ' ').toUpperCase()}
        </Link>
      ))}
    </aside>
  );
};

export default Sidebar;
