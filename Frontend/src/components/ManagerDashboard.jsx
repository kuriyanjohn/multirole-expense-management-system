import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Check, X, Edit, Trash2, Upload, Filter, Bell, 
  PieChart as PieChartIcon, Users, Calendar, DollarSign, 
  AlertTriangle, Settings, ChevronDown
} from 'lucide-react';

// Sample data - would be replaced with actual API calls
const MOCK_EMPLOYEES = [
  { id: 1, name: 'Jane Cooper', role: 'Developer', team: 'Engineering' },
  { id: 2, name: 'Alex Johnson', role: 'Designer', team: 'Design' },
  { id: 3, name: 'Michael Brown', role: 'QA Tester', team: 'Engineering' },
  { id: 4, name: 'Sarah Davis', role: 'Developer', team: 'Engineering' },
  { id: 5, name: 'Robert Wilson', role: 'Marketing', team: 'Marketing' },
];

const MOCK_CATEGORIES = [
  'Travel', 'Food & Dining', 'Office Supplies', 'Software', 
  'Hardware', 'Training', 'Events', 'Miscellaneous'
];

const MOCK_EXPENSES = [
  { 
    id: 101, 
    employeeId: 1, 
    employeeName: 'Jane Cooper',
    amount: 125.50, 
    category: 'Travel', 
    project: 'Client X Website', 
    date: '2025-03-15', 
    notes: 'Train tickets to client meeting', 
    receipt: 'receipt-101.pdf',
    status: 'pending',
    team: 'Engineering',
    submitted: '2025-03-16'
  },
  { 
    id: 102, 
    employeeId: 2, 
    employeeName: 'Alex Johnson',
    amount: 65.20, 
    category: 'Food & Dining', 
    project: 'Client X Website', 
    date: '2025-03-10', 
    notes: 'Team lunch during sprint planning', 
    receipt: 'receipt-102.pdf',
    status: 'approved',
    team: 'Design',
    submitted: '2025-03-12'
  },
  { 
    id: 103, 
    employeeId: 3, 
    employeeName: 'Michael Brown',
    amount: 299.99, 
    category: 'Hardware', 
    project: 'Internal', 
    date: '2025-03-05', 
    notes: 'New monitor for workstation', 
    receipt: 'receipt-103.pdf',
    status: 'rejected',
    team: 'Engineering',
    submitted: '2025-03-06'
  },
  { 
    id: 104, 
    employeeId: 4, 
    employeeName: 'Sarah Davis',
    amount: 49.99, 
    category: 'Software', 
    project: 'Internal', 
    date: '2025-03-18', 
    notes: 'Monthly subscription', 
    receipt: 'receipt-104.pdf',
    status: 'pending',
    team: 'Engineering',
    submitted: '2025-03-18'
  },
  { 
    id: 105, 
    employeeId: 5, 
    employeeName: 'Robert Wilson',
    amount: 550.00, 
    category: 'Events', 
    project: 'Marketing Campaign', 
    date: '2025-03-20', 
    notes: 'Booth setup at industry conference', 
    receipt: 'receipt-105.pdf',
    status: 'pending',
    team: 'Marketing',
    submitted: '2025-03-21'
  },
  { 
    id: 106, 
    employeeId: 1, 
    employeeName: 'Jane Cooper',
    amount: 35.75, 
    category: 'Office Supplies', 
    project: 'Internal', 
    date: '2025-03-22', 
    notes: 'Notebooks and pens', 
    receipt: 'receipt-106.pdf',
    status: 'pending',
    team: 'Engineering',
    submitted: '2025-03-22'
  },
  { 
    id: 107, 
    employeeId: 2, 
    employeeName: 'Alex Johnson',
    amount: 199.99, 
    category: 'Training', 
    project: 'Internal', 
    date: '2025-03-14', 
    notes: 'Online course subscription', 
    receipt: 'receipt-107.pdf',
    status: 'approved',
    team: 'Design',
    submitted: '2025-03-15'
  },
];

const MOCK_TEAM_BUDGETS = [
  { team: 'Engineering', budget: 5000, spent: 3250, remaining: 1750 },
  { team: 'Design', budget: 3000, spent: 1100, remaining: 1900 },
  { team: 'Marketing', budget: 4000, spent: 2800, remaining: 1200 },
];

const MOCK_NOTIFICATIONS = [
  { id: 201, title: 'New expense submitted', message: 'Jane Cooper submitted a new expense for approval', date: '2025-04-10', read: false },
  { id: 202, title: 'Budget alert', message: 'Marketing team has used 70% of monthly budget', date: '2025-04-09', read: true },
  { id: 203, title: 'Expense rejected', message: 'You rejected Michael Brown\'s hardware expense', date: '2025-04-07', read: true },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899', '#6b7280'];

const ManagerDashboard = () => {
  const [expenses, setExpenses] = useState(MOCK_EXPENSES);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedBudget, setSelectedBudget] = useState(null);
  
  // Get array of all teams
  const teams = ['All Teams', ...Array.from(new Set(MOCK_EMPLOYEES.map(employee => employee.team)))];
  
  // Calculate statistics
  const pendingExpenses = expenses.filter(expense => expense.status === 'pending').length;
  const pendingAmount = expenses
    .filter(expense => expense.status === 'pending')
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  // Filter expenses based on selected filters
  const filteredExpenses = expenses.filter(expense => {
    // Filter by team
    if (selectedTeam !== 'All Teams' && expense.team !== selectedTeam) return false;
    
    // Filter by status
    if (selectedStatus !== 'All Statuses' && expense.status !== selectedStatus.toLowerCase()) return false;
    
    // Filter by category
    if (selectedCategory !== 'All Categories' && expense.category !== selectedCategory) return false;
    
    // Filter by date range
    if (dateRange.start && new Date(expense.date) < new Date(dateRange.start)) return false;
    if (dateRange.end && new Date(expense.date) > new Date(dateRange.end)) return false;
    
    return true;
  });

  // Prepare data for charts
  const categoryData = MOCK_CATEGORIES.map(category => {
    const amount = filteredExpenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    return { name: category, value: amount };
  }).filter(item => item.value > 0);

  const employeeData = MOCK_EMPLOYEES.map(employee => {
    const amount = filteredExpenses
      .filter(expense => expense.employeeId === employee.id)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    return { name: employee.name, amount };
  }).filter(item => item.amount > 0);

  // Handle expense approval/rejection
  const handleApproveExpense = (id) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, status: 'approved' } : expense
    ));
    
    // Simulate notification
    addNotification(`Expense #${id} approved`, 'Notification sent to employee');
  };
  
  const handleRejectExpense = (id) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, status: 'rejected' } : expense
    ));
    
    // Simulate notification
    addNotification(`Expense #${id} rejected`, 'Notification sent to employee');
  };

  // Handle bulk actions
  const handleBulkApprove = () => {
    setExpenses(expenses.map(expense => 
      expense.status === 'pending' ? { ...expense, status: 'approved' } : expense
    ));
    
    // Simulate notification
    addNotification('Bulk approval completed', 'All pending expenses have been approved');
  };

  // Handle expense CRUD operations
  const handleCreateExpense = (data) => {
    const newExpense = {
      id: expenses.length + 200,
      ...data,
      status: 'pending',
      submitted: new Date().toISOString().substring(0, 10)
    };
    
    setExpenses([...expenses, newExpense]);
    setIsExpenseModalOpen(false);
    addNotification('New expense created', `${data.amount} for ${data.category}`);
  };
  
  const handleUpdateExpense = (data) => {
    setExpenses(expenses.map(expense => 
      expense.id === data.id ? { ...expense, ...data } : expense
    ));
    
    setIsExpenseModalOpen(false);
    addNotification('Expense updated', `Expense #${data.id} has been updated`);
  };
  
  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
    addNotification('Expense deleted', `Expense #${id} has been deleted`);
  };

  // Handle budget operations
  const handleUpdateBudget = (data) => {
    // Update budget logic would go here
    setIsBudgetModalOpen(false);
    addNotification('Budget updated', `Budget for ${data.team} updated to $${data.budget}`);
  };

  // Notification handling
  const addNotification = (title, message) => {
    const newNotification = {
      id: notifications.length + 300,
      title,
      message,
      date: new Date().toISOString().substring(0, 10),
      read: false
    };
    
    setNotifications([newNotification, ...notifications]);
  };
  
  const markNotificationsAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const unreadNotifications = notifications.filter(notification => !notification.read).length;

  return (
    <div className="manager-dashboard">
      {/* Header with notifications */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Manager Dashboard</h1>
        <div className="dashboard-actions">
          <div className="notification-wrapper">
            <button 
              className="btn btn-ghost notification-btn" 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <Bell size={20} />
              {unreadNotifications > 0 && (
                <span className="notification-badge">{unreadNotifications}</span>
              )}
            </button>
            
            {isNotificationsOpen && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Notifications</h3>
                  {unreadNotifications > 0 && (
                    <button 
                      className="btn btn-ghost btn-sm"
                      onClick={markNotificationsAsRead}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                
                <div className="notification-list">
                  {notifications.length === 0 ? (
                    <p className="text-gray-500">No notifications</p>
                  ) : (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      >
                        <h4>{notification.title}</h4>
                        <p>{notification.message}</p>
                        <span className="notification-date">{notification.date}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <button 
            className="btn btn-primary"
            onClick={() => {
              setSelectedExpense(null);
              setIsExpenseModalOpen(true);
            }}
          >
            New Expense
          </button>
          
          <button 
            className="btn btn-outline"
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
      <div className="stats-grid">
        <div className="stats-card">
          <div className="stats-icon">
            <AlertTriangle size={24} className="text-yellow-600" />
          </div>
          <div className="stats-content">
            <h3>{pendingExpenses}</h3>
            <p>Pending Approvals</p>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="stats-icon">
            <DollarSign size={24} className="text-blue-600" />
          </div>
          <div className="stats-content">
            <h3>${pendingAmount.toFixed(2)}</h3>
            <p>Pending Amount</p>
          </div>
        </div>
        
        {MOCK_TEAM_BUDGETS.filter(budget => 
          selectedTeam === 'All Teams' || budget.team === selectedTeam
        ).map(budget => (
          <div key={budget.team} className="stats-card budget-card">
            <div className="stats-content">
              <div className="budget-header">
                <h3>{budget.team}</h3>
                <span className={budget.remaining / budget.budget < 0.2 ? 'text-red-500' : 'text-green-600'}>
                  ${budget.remaining.toFixed(2)} remaining
                </span>
              </div>
              <div className="budget-progress">
                <div 
                  className="budget-bar" 
                  style={{ 
                    width: `${(budget.spent / budget.budget) * 100}%`,
                    backgroundColor: budget.spent / budget.budget > 0.8 ? '#ef4444' : '#3b82f6'
                  }}
                />
              </div>
              <div className="budget-details">
                <span>${budget.spent.toFixed(2)} of ${budget.budget.toFixed(2)}</span>
                <span>{((budget.spent / budget.budget) * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Filters */}
      <div className="filters-section">
        <div className="filters-header">
          <h2>
            <Filter size={18} className="mr-2" />
            Filters
          </h2>
        </div>
        
        <div className="filters-grid">
          <div className="filter-group">
            <label>Team</label>
            <select 
              value={selectedTeam} 
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Status</label>
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Category</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All Categories">All Categories</option>
              {MOCK_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>From</label>
            <input 
              type="date" 
              value={dateRange.start} 
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>
          
          <div className="filter-group">
            <label>To</label>
            <input 
              type="date" 
              value={dateRange.end} 
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
          
          <div className="filter-actions">
            <button 
              className="btn btn-outline"
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
      </div>
      
      {/* Charts Section */}
      <div className="charts-section">
        <div className="charts-grid">
          <div className="chart-card">
            <div className="card-header">
              <h3 className="card-title">
                <PieChartIcon size={18} className="mr-2" />
                Expenses by Category
              </h3>
            </div>
            <div className="card-content">
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
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
          </div>
          
          <div className="chart-card">
            <div className="card-header">
              <h3 className="card-title">
                <Users size={18} className="mr-2" />
                Expenses by Employee
              </h3>
            </div>
            <div className="card-content">
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
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
        </div>
      </div>
      
      {/* Pending Expenses Table */}
      <div className="expenses-section">
        <div className="section-header">
          <h2>Pending Approvals</h2>
          {filteredExpenses.some(expense => expense.status === 'pending') && (
            <button className="btn btn-outline" onClick={handleBulkApprove}>
              <Check size={16} className="mr-2" />
              Approve All
            </button>
          )}
        </div>
        
        {filteredExpenses.filter(expense => expense.status === 'pending').length === 0 ? (
          <div className="empty-state">
            <p>No pending expenses to approve</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Project</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses
                  .filter(expense => expense.status === 'pending')
                  .map(expense => (
                    <tr key={expense.id}>
                      <td>{expense.employeeName}</td>
                      <td>{expense.date}</td>
                      <td>{expense.category}</td>
                      <td>{expense.project || '—'}</td>
                      <td>${expense.amount.toFixed(2)}</td>
                      <td>
                        <span className="badge badge-outline">Pending</span>
                      </td>
                      <td className="actions-cell">
                        <button 
                          className="btn btn-ghost action-btn approve"
                          onClick={() => handleApproveExpense(expense.id)}
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          className="btn btn-ghost action-btn reject"
                          onClick={() => handleRejectExpense(expense.id)}
                        >
                          <X size={16} />
                        </button>
                        <button 
                          className="btn btn-ghost action-btn"
                          onClick={() => {
                            setSelectedExpense(expense);
                            setIsExpenseModalOpen(true);
                          }}
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
      <div className="expenses-section">
        <div className="section-header">
          <h2>All Expenses</h2>
        </div>
        
        {filteredExpenses.length === 0 ? (
          <div className="empty-state">
            <p>No expenses found matching your filters</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Project</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map(expense => (
                  <tr key={expense.id}>
                    <td>{expense.employeeName}</td>
                    <td>{expense.date}</td>
                    <td>{expense.category}</td>
                    <td>{expense.project || '—'}</td>
                    <td>${expense.amount.toFixed(2)}</td>
                    <td>
                      <span className={`badge badge-${
                        expense.status === 'approved' 
                          ? 'success' 
                          : expense.status === 'rejected' 
                          ? 'destructive' 
                          : 'outline'
                      }`}>
                        {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="btn btn-ghost action-btn"
                        onClick={() => {
                          setSelectedExpense(expense);
                          setIsExpenseModalOpen(true);
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn btn-ghost action-btn delete"
                        onClick={() => handleDeleteExpense(expense.id)}
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
      
      {/* Expense Modal */}
      {isExpenseModalOpen && (
        <ExpenseModal
          expense={selectedExpense}
          employees={MOCK_EMPLOYEES}
          categories={MOCK_CATEGORIES}
          onSave={selectedExpense ? handleUpdateExpense : handleCreateExpense}
          onClose={() => setIsExpenseModalOpen(false)}
        />
      )}
      
      {/* Budget Modal */}
      {isBudgetModalOpen && (
        <BudgetModal
          teams={teams.filter(team => team !== 'All Teams')}
          budgets={MOCK_TEAM_BUDGETS}
          selectedBudget={selectedBudget}
          onSave={handleUpdateBudget}
          onClose={() => setIsBudgetModalOpen(false)}
        />
      )}
    </div>
  );
};

// Expense Modal Component
const ExpenseModal = ({ expense, employees, categories, onSave, onClose }) => {
  const [formData, setFormData] = useState(
    expense 
      ? { ...expense }
      : {
          employeeId: '',
          employeeName: '',
          amount: '',
          category: '',
          project: '',
          date: new Date().toISOString().substring(0, 10),
          notes: '',
          receipt: '',
          team: '',
        }
  );
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // If employee is selected, automatically set team
    if (name === 'employeeId') {
      const selectedEmployee = employees.find(emp => emp.id === parseInt(value));
      if (selectedEmployee) {
        setFormData({
          ...formData, 
          employeeId: parseInt(value),
          employeeName: selectedEmployee.name,
          team: selectedEmployee.team
        });
      }
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{expense ? 'Edit Expense' : 'Create Expense'}</h2>
          <button className="btn btn-ghost" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Employee</label>
              <select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
              >
                <option value="">Select Employee</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} ({employee.team})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Project/Client (Optional)</label>
              <input
                type="text"
                name="project"
                value={formData.project}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Receipt</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="receipt"
                name="receipt"
                className="file-input"
              />
              <label htmlFor="receipt" className="file-input-label">
              <Upload size={16} className="mr-2" />
              {formData.receipt ? formData.receipt : 'Upload Receipt'}
            </label>
          </div>
        </div>
        
        <div className="modal-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {expense ? 'Save Changes' : 'Create Expense'}
          </button>
        </div>
      </form>
    </div>
  </div>
);
};

// Budget Modal Component
const BudgetModal = ({ teams, budgets, selectedBudget, onSave, onClose }) => {
const [formData, setFormData] = useState(
  selectedBudget 
    ? { ...selectedBudget }
    : {
        team: teams[0] || '',
        budget: '',
        spent: 0,
        remaining: 0
      }
);

useEffect(() => {
  // If team changes, find existing budget data
  if (formData.team) {
    const existingBudget = budgets.find(b => b.team === formData.team);
    if (existingBudget) {
      setFormData({
        ...formData,
        budget: existingBudget.budget,
        spent: existingBudget.spent,
        remaining: existingBudget.budget - existingBudget.spent
      });
    }
  }
}, [formData.team, budgets]);

const handleChange = (e) => {
  const { name, value } = e.target;
  
  if (name === 'budget') {
    const budget = parseFloat(value) || 0;
    const remaining = budget - formData.spent;
    setFormData({ 
      ...formData, 
      budget,
      remaining
    });
  } else {
    setFormData({ ...formData, [name]: value });
  }
};

const handleSubmit = (e) => {
  e.preventDefault();
  onSave({
    ...formData,
    budget: parseFloat(formData.budget)
  });
};

return (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="modal-header">
        <h2>Manage Budget</h2>
        <button className="btn btn-ghost" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Team</label>
            <select
              name="team"
              value={formData.team}
              onChange={handleChange}
              required
            >
              {teams.map(team => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Budget Amount</label>
            <input
              type="number"
              name="budget"
              step="0.01"
              value={formData.budget}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        {formData.spent > 0 && (
          <div className="budget-status">
            <div className="budget-info">
              <p>Amount Spent: <strong>${formData.spent.toFixed(2)}</strong></p>
              <p>Remaining: <strong>${formData.remaining.toFixed(2)}</strong></p>
            </div>
            <div className="budget-progress">
              <div 
                className="budget-bar" 
                style={{ 
                  width: `${(formData.spent / formData.budget) * 100}%`,
                  backgroundColor: formData.spent / formData.budget > 0.8 ? '#ef4444' : '#3b82f6'
                }}
              />
            </div>
            <p className="text-sm text-gray-500">
              {((formData.spent / formData.budget) * 100).toFixed(0)}% of budget used
            </p>
          </div>
        )}
        
        <div className="modal-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Budget
          </button>
        </div>
      </form>
    </div>
  </div>
);
};

export default ManagerDashboard;