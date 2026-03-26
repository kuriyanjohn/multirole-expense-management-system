import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, role, title }) => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar role={role} />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary-100/50 blur-3xl z-0 pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[30%] h-[30%] rounded-full bg-blue-100/50 blur-3xl z-0 pointer-events-none"></div>

        <Header title={title} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-6 lg:p-8 z-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
