import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, LogOut, ShieldCheck, DollarSign } from 'lucide-react';

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getLinks = () => {
    if (role === 'admin') {
      return [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/expenses', icon: DollarSign, label: 'All Expenses' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' }
      ];
    }
    if (role === 'manager') {
      return [
        { path: '/manager', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/manager/team', icon: Users, label: 'Team Expenses' },
        { path: '/manager/settings', icon: Settings, label: 'Settings' }
      ];
    }
    return [
      { path: '/employee', icon: LayoutDashboard, label: 'My Dashboard' },
      { path: '/employee/expenses', icon: FileText, label: 'My Expenses' }
    ];
  };

  return (
    <aside className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col transition-all duration-300">
      <div className="h-20 flex items-center px-6 border-b border-slate-800">
        <ShieldCheck className="text-primary-500 h-8 w-8" />
        <span className="text-xl font-bold ml-3 text-white tracking-wide">Acme Spend</span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {getLinks().map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary-600 shadow-md shadow-primary-900/50 text-white translate-x-1' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
