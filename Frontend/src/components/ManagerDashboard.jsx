import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Check, X, Edit, Trash2, Upload, Filter, Settings, DollarSign, 
  AlertTriangle, Users, PieChart as PieChartIcon
} from 'lucide-react';

const ManagerDashboard = () => {
  const [users,setUsers]=useState([])
  const [expenses, setExpenses] = useState([]);
  const [teamBudgets, setTeamBudgets] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);
  
  // Mock data - in a real app, this would come from API
  const categories = ['Travel', 'Meals', 'Office Supplies', 'Software', 'Hardware', 'Entertainment', 'Other'];
  // const users = [
  //   { id: 1, name: 'John Smith', team: 'Engineering' },
  //   { id: 2, name: 'Sarah Lee', team: 'Engineering' },
  //   { id: 3, name: 'Mike Johnson', team: 'Marketing' },
  //   { id: 4, name: 'Lisa Wong', team: 'Marketing' },
  //   { id: 5, name: 'David Chen', team: 'Sales' },
  //   { id: 6, name: 'Emma Garcia', team: 'Sales' }
  // ];

  useEffect(() => {
    // Mock API call to fetch expenses
    const mockExpenses = [
      { id: 101, employeeId: 1, employeeName: 'John Smith', team: 'Engineering', amount: 350.75, category: 'Travel', date: '2025-04-10', project: 'Backend Refactor', status: 'pending', notes: 'Flight to conference' },
      { id: 102, employeeId: 2, employeeName: 'Sarah Lee', team: 'Engineering', amount: 45.30, category: 'Meals', date: '2025-04-12', project: 'Client Meeting', status: 'approved', notes: 'Lunch with client' },
      { id: 103, employeeId: 3, employeeName: 'Mike Johnson', team: 'Marketing', amount: 125.00, category: 'Software', date: '2025-04-15', project: 'Campaign Tools', status: 'pending', notes: 'Monthly subscription' },
      { id: 104, employeeId: 4, employeeName: 'Lisa Wong', team: 'Marketing', amount: 89.99, category: 'Office Supplies', date: '2025-04-16', project: '', status: 'rejected', notes: 'Printer ink' },
      { id: 105, employeeId: 5, employeeName: 'David Chen', team: 'Sales', amount: 250.00, category: 'Entertainment', date: '2025-04-17', project: 'Client Dinner', status: 'pending', notes: 'Dinner with potential client' }
    ];
    
    // Mock API call to fetch team budgets
    const mockBudgets = [
      { team: 'Engineering', budget: 10000, spent: 3500, remaining: 6500 },
      { team: 'Marketing', budget: 8000, spent: 4200, remaining: 3800 },
      { team: 'Sales', budget: 12000, spent: 5800, remaining: 6200 }
    ];
    
    setExpenses(mockExpenses);
    setTeamBudgets(mockBudgets);
  }, []);
  
  const teams = ['All Teams', ...Array.from(new Set(users.map(employee => employee.team)))];
  
  const pendingAmount = expenses
    .filter(expense => expense.status === 'pending')
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const pendingExpenses = expenses.filter(expense => expense.status === 'pending').length;
    
  const filteredExpenses = expenses.filter(expense => {
    if (selectedTeam !== 'All Teams' && expense.team !== selectedTeam) return false;
    if (selectedStatus !== 'All Statuses' && expense.status !== selectedStatus.toLowerCase()) return false;
    if (selectedCategory !== 'All Categories' && expense.category !== selectedCategory) return false;
    if (dateRange.start && new Date(expense.date) < new Date(dateRange.start)) return false;
    if (dateRange.end && new Date(expense.date) > new Date(dateRange.end)) return false;
    return true;
  });
  
  // Data for charts
  const categoryData = categories.map(category => {
    const amount = filteredExpenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    return { name: category, value: amount };
  }).filter(item => item.value > 0);
  
  const employeeData = users.map(employee => {
    const amount = filteredExpenses
      .filter(expense => expense.employeeId === employee.id)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    return { name: employee.name, amount };
  }).filter(item => item.amount > 0);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2', '#48C9B0'];
  
  // Expense handlers
  const handleApproveExpense = (id) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, status: 'approved' } : expense
    ));
  };
  
  const handleRejectExpense = (id) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, status: 'rejected' } : expense
    ));
  };
  
  const handleBulkApprove = () => {
    setExpenses(expenses.map(expense => 
      expense.status === 'pending' ? { ...expense, status: 'approved' } : expense
    ));
  };
  
  const handleUpdateExpense = (data) => {
    setExpenses(expenses.map(expense => 
      expense.id === data.id ? { ...expense, ...data } : expense
    ));
    
    setIsExpenseModalOpen(false);
  };
  
  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };
  
  // Budget handlers
  const handleUpdateBudget = (data) => {
    const updatedBudgets = teamBudgets.map(budget => 
      budget.team === data.team ? { ...budget, budget: data.budget, remaining: data.budget - budget.spent } : budget
    );
    setTeamBudgets(updatedBudgets);
    setIsBudgetModalOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manager Dashboard</h1>
        <div className="flex gap-4">
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            onClick={() => {
              setSelectedBudget(null);
              setIsBudgetModalOpen(true);
            }}
          >
            <Settings size={16} className="mr-2" />
            Manage Budgets
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  {/* Pending Approvals Box */}
  <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
    <div className="flex items-center">
      <div className="bg-yellow-100 p-3 rounded-full mr-4">
        <AlertTriangle size={24} className="text-yellow-600" />
      </div>
      <div>
        <h3 className="text-2xl font-bold">{pendingExpenses}</h3>
        <p className="text-gray-500">Pending Approvals</p>
      </div>
    </div>
  </div>

  {/* Pending Amount Box */}
  <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
    <div className="flex items-center">
      <div className="bg-blue-100 p-3 rounded-full mr-4">
        <DollarSign size={24} className="text-blue-600" />
      </div>
      <div>
        <h3 className="text-2xl font-bold">${pendingAmount.toFixed(2)}</h3>
        <p className="text-gray-500">Pending Amount</p>
      </div>
    </div>
  </div>

  {/* Team Budget Box */}
  {teamBudgets.filter(budget =>
    selectedTeam === 'All Teams' || budget.team === selectedTeam
  ).slice(0, 1).map(budget => (
    <div key={budget.team} className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">{budget.team}</h3>
        <span className={budget.remaining / budget.budget < 0.2 ? 'text-red-500' : 'text-green-600'}>
          ${budget.remaining.toFixed(2)} remaining
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div
          className="h-2.5 rounded-full"
          style={{
            width: `${(budget.spent / budget.budget) * 100}%`,
            backgroundColor: budget.spent / budget.budget > 0.8 ? '#ef4444' : '#3b82f6'
          }}
        />
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>${budget.spent.toFixed(2)} of ${budget.budget.toFixed(2)}</span>
        <span>{((budget.spent / budget.budget) * 100).toFixed(0)}%</span>
      </div>
    </div>
  ))}
</div>

      
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex items-center mb-4">
          <Filter size={18} className="mr-2" />
          <h2 className="text-xl font-bold">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
            <select 
              className="w-full border border-gray-300 rounded-md p-2"
              value={selectedTeam} 
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              className="w-full border border-gray-300 rounded-md p-2"
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              className="w-full border border-gray-300 rounded-md p-2"
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All Categories">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input 
              type="date" 
              className="w-full border border-gray-300 rounded-md p-2"
              value={dateRange.start} 
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input 
              type="date" 
              className="w-full border border-gray-300 rounded-md p-2"
              value={dateRange.end} 
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button 
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md"
            onClick={() => {
              setSelectedTeam('All Teams');
              setSelectedStatus('All Statuses');
              setSelectedCategory('All Categories');
              setDateRange({ start: '', end: '' });
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <PieChartIcon size={18} className="mr-2" />
            <h3 className="text-xl font-bold">Expenses by Category</h3>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Users size={18} className="mr-2" />
            <h3 className="text-xl font-bold">Expenses by Employee</h3>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Pending Expenses Table */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Pending Approvals</h2>
          {filteredExpenses.some(expense => expense.status === 'pending') && (
            <button 
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center"
              onClick={handleBulkApprove}
            >
              <Check size={16} className="mr-2" />
              Approve All
            </button>
          )}
        </div>
        
        {filteredExpenses.filter(expense => expense.status === 'pending').length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <p>No pending expenses to approve</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Employee</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Project</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses
                  .filter(expense => expense.status === 'pending')
                  .map(expense => (
                    <tr key={expense.id} className="border-b border-gray-200">
                      <td className="p-3">{expense.employeeName}</td>
                      <td className="p-3">{expense.date}</td>
                      <td className="p-3">{expense.category}</td>
                      <td className="p-3">{expense.project || '—'}</td>
                      <td className="p-3">${expense.amount.toFixed(2)}</td>
                      <td className="p-3">
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Pending
                        </span>
                      </td>
                      <td className="p-3 flex gap-2">
                        <button 
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                          onClick={() => handleApproveExpense(expense.id)}
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          onClick={() => handleRejectExpense(expense.id)}
                          title="Reject"
                        >
                          <X size={16} />
                        </button>
                        <button 
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          onClick={() => {
                            setSelectedExpense(expense);
                            setIsExpenseModalOpen(true);
                          }}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* All Expenses Table */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">All Transactions</h2>
        </div>
        
        {filteredExpenses.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <p>No expenses found matching your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Employee</th>
                  <th className="p-3 text-left">Team</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Project</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map(expense => (
                  <tr key={expense.id} className="border-b border-gray-200">
                    <td className="p-3">{expense.employeeName}</td>
                    <td className="p-3">{expense.team}</td>
                    <td className="p-3">{expense.date}</td>
                    <td className="p-3">{expense.category}</td>
                    <td className="p-3">{expense.project || '—'}</td>
                    <td className="p-3">${expense.amount.toFixed(2)}</td>
                    <td className="p-3">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                        expense.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : expense.status === 'rejected' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button 
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        onClick={() => {
                          setSelectedExpense(expense);
                          setIsExpenseModalOpen(true);
                        }}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        onClick={() => handleDeleteExpense(expense.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Team Budget Overview */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Team Budgets</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamBudgets.map(budget => (
            <div key={budget.team} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">{budget.team}</h3>
                <button 
                  className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                  onClick={() => {
                    setSelectedBudget(budget);
                    setIsBudgetModalOpen(true);
                  }}
                >
                  <Edit size={16} />
                </button>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Budget: <strong>${budget.budget.toFixed(2)}</strong></span>
                  <span className={budget.remaining / budget.budget < 0.2 ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}>
                    ${budget.remaining.toFixed(2)} remaining
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full" 
                    style={{ 
                      width: `${(budget.spent / budget.budget) * 100}%`,
                      backgroundColor: budget.spent / budget.budget > 0.8 ? '#ef4444' : '#3b82f6'
                    }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Spent: ${budget.spent.toFixed(2)}</span>
                  <span>{((budget.spent / budget.budget) * 100).toFixed(0)}% used</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedExpense ? 'Edit Expense' : 'Create Expense'}
              </h2>
              <button 
                className="text-gray-500 hover:text-gray-700" 
                onClick={() => setIsExpenseModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateExpense({
                ...selectedExpense,
                // In a real app, we'd update with form values
              });
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md p-2"
                    defaultValue={selectedExpense?.employeeId || ""}
                    disabled
                  >
                    <option value="">Select Employee</option>
                    {users.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} ({employee.team})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-md p-2"
                    defaultValue={selectedExpense?.amount || ""}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md p-2"
                    defaultValue={selectedExpense?.category || ""}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md p-2"
                    defaultValue={selectedExpense?.status || "pending"}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <button 
                  type="button"
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md"
                  onClick={() => setIsExpenseModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Budget Modal */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Manage Budget</h2>
              <button 
                className="text-gray-500 hover:text-gray-700" 
                onClick={() => setIsBudgetModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              // Get the form data
              const formData = new FormData(e.target);
              const team = formData.get('team');
              const budget = parseFloat(formData.get('budget'));
              
              // Find the current budget for this team
              const currentBudget = teamBudgets.find(b => b.team === team);
              
              handleUpdateBudget({
                team,
                budget,
                spent: currentBudget ? currentBudget.spent : 0,
                remaining: budget - (currentBudget ? currentBudget.spent : 0)
              });
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team
                </label>
                <select
                  name="team"
                  className="w-full border border-gray-300 rounded-md p-2"
                  defaultValue={selectedBudget?.team || teams.find(t => t !== 'All Teams')}
                >
                  {teams.filter(team => team !== 'All Teams').map(team => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Amount
                </label>
                <input
                  type="number"
                  name="budget"
                  className="w-full border border-gray-300 rounded-md p-2"
                  defaultValue={selectedBudget?.budget || ""}
                  step="0.01"
                  required
                />
              </div>
              
              {selectedBudget && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Currently Spent: <strong>${selectedBudget.spent.toFixed(2)}</strong></span>
                    <span>Remaining: <strong>${selectedBudget.remaining.toFixed(2)}</strong></span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full" 
                      style={{ 
                        width: `${(selectedBudget.spent / selectedBudget.budget) * 100}%`,
                        backgroundColor: selectedBudget.spent / selectedBudget.budget > 0.8 ? '#ef4444' : '#3b82f6'
                      }}
                    />
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-1">
                    {((selectedBudget.spent / selectedBudget.budget) * 100).toFixed(0)}% of budget used
                  </p>
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                <button 
                  type="button"
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md"
                  onClick={() => setIsBudgetModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;