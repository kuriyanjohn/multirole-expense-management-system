import React from 'react';
import { Bell, Search, User as UserIcon } from 'lucide-react';

const Header = ({ title }) => {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all outline-none text-sm w-64"
          />
        </div>
        
        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center space-x-3 pl-6 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-700">User Profile</p>
            <p className="text-xs text-slate-500">Active</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md cursor-pointer hover:shadow-lg transition">
            <UserIcon className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
