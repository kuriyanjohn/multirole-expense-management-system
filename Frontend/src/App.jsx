import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/dashboard';
import ExpenseList from './components/expenseList';
import Login from './components/login';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [expenses] = useState([
    { description: 'Office Supplies', amount: 1500, date: '2025-04-01' },
    { description: 'Travel', amount: 3200, date: '2025-04-03' },
  ]);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="flex h-screen">
      <Sidebar role={user.role} />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-4 overflow-y-auto">
          <Dashboard user={user} />
          <ExpenseList expenses={expenses} />
        </main>
      </div>
    </div>
  );
};

export default App;
 