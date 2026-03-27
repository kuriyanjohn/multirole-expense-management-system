import React, { useState } from 'react';
import { Bell, Search, User as UserIcon, LogOut } from 'lucide-react';

const Header = ({ title }) => {
  const [showProfile, setShowProfile] = useState(false);
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

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
            <p className="text-sm font-semibold text-slate-700">{user ? user.name : 'User Profile'}</p>
            <p className="text-xs text-slate-500 capitalize">{user ? user.role : 'Active'}</p>
          </div>
          <div className="relative">
            <div 
              className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md cursor-pointer hover:shadow-lg transition"
              onClick={() => setShowProfile(!showProfile)}
            >
              <UserIcon className="h-5 w-5" />
            </div>

            {showProfile && user && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-[0_10px_40px_-5px_rgb(0,0,0,0.15)] border border-slate-100 p-4 z-50 animate-fade-in">
                <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-slate-100">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-slate-800 text-sm truncate">{user.name}</h3>
                    <p className="text-xs text-slate-500 truncate w-36">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-md capitalize font-medium tracking-wide">
                      {user.role} account
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
