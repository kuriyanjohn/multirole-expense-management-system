import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, 
  LineChart, Line, CartesianGrid, ResponsiveContainer 
} from 'recharts';
import { 
  Users, FileText, Settings, Tag, DollarSign, CheckCircle, XCircle, Clock,
  Bell, Filter, Calendar, Search, Plus, Edit, Trash2, ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button, buttonVariants }  from "../components/ui/button"
import  Input  from "../components/ui/input"
import Textarea from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Badge, badgeVariants } from "../components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import Label from "../components/ui/label"
import axios from "axios";
import { toast } from 'react-toastify';
const token = localStorage.getItem("token"); 


const AdminDashboard = ({ data, onLogout }) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        setDashboardData(result);
      } catch (error) {
        console.error("Failed to fetch admin dashboard data:", error);
      }
    };
  
    fetchData();
  }, []);
  const [dashboardData, setDashboardData] = useState({});

  // State management for various features
  const sampleExpenses = dashboardData.expenses || [];
const usersList = dashboardData.users || [];
const companies = dashboardData.companies || [];
const categories = dashboardData.categories || [];
const monthlyTrend = dashboardData.monthlyTrend || [];

  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterTeam, setFilterTeam] = useState('all');
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  
  // Colors for charts
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  
  
  
  const notifications = [
    { id: 1, message: "New expense report submitted by Jane Smith", time: "10 minutes ago", read: false },
    { id: 2, message: "Expense #1042 was approved", time: "1 hour ago", read: false },
    { id: 3, message: "Budget limit warning for Engineering team", time: "3 hours ago", read: true }
  ];
  
  // Functions for various actions
  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedExpense(item);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExpense(null);
  };
  
  const handleApproval = (id, newStatus) => {
    // In a real app, this would call an API to update the status
    console.log(`Expense #${id} status changed to ${newStatus}`);
  };
  
  const handleDelete = (id) => {
    // In a real app, this would call an API to delete the item
    console.log(`Deleting item #${id}`);
  };
  
  // Filter expenses based on selected filters
  const filteredExpenses = sampleExpenses.filter(expense => {
    return (filterStatus === 'all' || expense.status === filterStatus) &&
           (filterCategory === 'all' || expense.category === filterCategory) &&
           (filterTeam === 'all' || expense.team === filterTeam);
  });
  
  // Calculate summary statistics
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingCount = filteredExpenses.filter(e => e.status === 'pending').length;
  const approvedCount = filteredExpenses.filter(e => e.status === 'approved').length;
  const rejectedCount = filteredExpenses.filter(e => e.status === 'rejected').length;
  
  // Render different content based on active tab
  const renderTabContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'expenses':
        return renderExpenses();
      case 'users':
        return renderUsers();
      case 'companies':
        return renderCompanies();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };
  
  // Dashboard tab content
  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="mr-4 bg-indigo-100 p-3 rounded-full">
            <DollarSign className="text-indigo-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="text-xl font-semibold">${totalExpenses.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="mr-4 bg-yellow-100 p-3 rounded-full">
            <Clock className="text-yellow-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Approval</p>
            <p className="text-xl font-semibold">{pendingCount}</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="mr-4 bg-green-100 p-3 rounded-full">
            <CheckCircle className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Approved</p>
            <p className="text-xl font-semibold">{approvedCount}</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="mr-4 bg-red-100 p-3 rounded-full">
            <XCircle className="text-red-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Rejected</p>
            <p className="text-xl font-semibold">{rejectedCount}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2 text-gray-700">Expenses by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data?.categoryStats || [
                  { category: 'Travel', value: 3500 },
                  { category: 'Office Supplies', value: 1200 },
                  { category: 'Training', value: 2400 },
                  { category: 'Equipment', value: 4100 },
                  { category: 'Client Meeting', value: 1800 }
                ]}
                dataKey="value"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {(data?.categoryStats || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2 text-gray-700">Expenses by Team</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data?.teamStats || [
                { team: 'Marketing', amount: 4200 },
                { team: 'Engineering', amount: 6800 },
                { team: 'Sales', amount: 5100 },
                { team: 'HR', amount: 2300 }
              ]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="team" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="amount" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="font-semibold mb-2 text-gray-700">Monthly Expense Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={monthlyTrend}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#4F46E5" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
  
  // Expenses tab content
  const renderExpenses = () => (
    <>
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-700">All Expense Reports</h3>
          <div className="flex space-x-2">
            <button 
              className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              onClick={() => openModal('newExpense')}
            >
              <Plus size={16} className="mr-1" />
              New Expense
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center">
            <Filter size={16} className="mr-1 text-gray-500" />
            <span className="text-sm text-gray-500 mr-2">Filters:</span>
          </div>
          
          <select 
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <select 
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((category, idx) => (
              <option key={idx} value={category}>{category}</option>
            ))}
          </select>
          
          <select 
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
          >
            <option value="all">All Teams</option>
            <option value="Marketing">Marketing</option>
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
            <option value="HR">HR</option>
          </select>
          
          <div className="flex items-center ml-auto">
            <label className="text-sm text-gray-500 mr-2">Date Range:</label>
            <input 
              type="date" 
              className="px-2 py-1 border border-gray-300 rounded-lg text-sm mr-1"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            />
            <span className="text-gray-500 mx-1">to</span>
            <input 
              type="date" 
              className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{expense.employee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{expense.team}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{expense.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">${expense.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{expense.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      expense.status === 'approved' ? 'bg-green-100 text-green-800' :
                      expense.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {expense.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApproval(expense.id, 'approved')}
                            className="text-green-600 hover:text-green-800"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => handleApproval(expense.id, 'rejected')}
                            className="text-red-600 hover:text-red-800"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => openModal('editExpense', expense)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(expense.id)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
  
  // Users tab content
  const renderUsers = () => (
    <>
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-700">User Management</h3>
          <button 
            className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            onClick={() => openModal('newUser')}
          >
            <Plus size={16} className="mr-1" />
            Add User
          </button>
        </div>
        
        <div className="flex justify-between mb-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search users..." 
              className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg"
            />
            <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
          </div>
          
          <select className="px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">All Companies</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usersList.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.team}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => openModal('editUser', user)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
  
  // Companies tab content
  const renderCompanies = () => (
    <>
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-700">Company Management</h3>
          <button 
            className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            onClick={() => openModal('newCompany')}
          >
            <Plus size={16} className="mr-1" />
            Add Company
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Budget</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {companies.map((company) => (
                <tr key={company.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{company.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">${company.monthlyBudget.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {usersList.filter(user => user.company === company.name).length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => openModal('editCompany', company)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(company.id)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
  
  // Settings tab content
  const renderSettings = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-4 text-gray-700">Expense Categories</h3>
          <div className="space-y-2 mb-4">
            {categories.map((category, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 border border-gray-200 rounded">
                <span>{category}</span>
                <button className="text-gray-600 hover:text-gray-800">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex mt-4">
            <input 
              type="text" 
              placeholder="New category name" 
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700">
              Add
            </button>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-4 text-gray-700">Notification Settings</h3>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input type="checkbox" id="notify-submission" className="mr-2" defaultChecked />
              <label htmlFor="notify-submission">Expense submission notifications</label>
            </div>
            
            <div className="flex items-center">
              <input type="checkbox" id="notify-approval" className="mr-2" defaultChecked />
              <label htmlFor="notify-approval">Approval/rejection notifications</label>
            </div>
            
            <div className="flex items-center">
              <input type="checkbox" id="notify-budget" className="mr-2" defaultChecked />
              <label htmlFor="notify-budget">Budget limit warnings</label>
            </div>
            
            <div className="flex items-center">
              <input type="checkbox" id="notify-email" className="mr-2" defaultChecked />
              <label htmlFor="notify-email">Email notifications</label>
            </div>
            
            <div className="flex items-center">
              <input type="checkbox" id="notify-app" className="mr-2" defaultChecked />
              <label htmlFor="notify-app">In-app notifications</label>
            </div>
          </div>
          
          <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Save Settings
          </button>
        </div>
      </div>
    </>
  );
  const renderModal = () => {
    if (!isModalOpen) return null;
    
    let modalContent;
    
    switch(modalType) {
      case 'newExpense':
      case 'editExpense':
        modalContent = (
          <>
            <h3 className="text-lg font-semibold mb-4">
              {modalType === 'newExpense' ? 'Create New Expense' : 'Edit Expense'}
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg" defaultValue={selectedExpense?.employee || ''}>
                  <option value="" disabled>Select Employee</option>
                  {usersList.map(user => (
                    <option key={user.id} value={user.name}>{user.name}</option>
                  ))}
                </select>
              </div>
              
  <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg" defaultValue={selectedExpense?.category || ''}>
                  <option value="" disabled>Select Category</option>
                  {categories.map((category, idx) => (
                    <option key={idx} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
                  placeholder="0.00" 
                  defaultValue={selectedExpense?.amount || ''}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  defaultValue={selectedExpense?.date || new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg" defaultValue={selectedExpense?.status || 'pending'}>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
                  rows="3"
                  placeholder="Enter expense description..."
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <button 
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {modalType === 'newExpense' ? 'Create' : 'Update'}
                </button>
              </div>
            </form>
          </>
        );
        break;
        
      case 'newUser':
      case 'editUser':
        modalContent = (
          <>
            <h3 className="text-lg font-semibold mb-4">
              {modalType === 'newUser' ? 'Add New User' : 'Edit User'}
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
                  placeholder="Full Name" 
                  defaultValue={selectedExpense?.name || ''}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
                  placeholder="email@example.com" 
                  defaultValue={selectedExpense?.email || ''}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg" defaultValue={selectedExpense?.role || ''}>
                  <option value="" disabled>Select Role</option>
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg" defaultValue={selectedExpense?.team || ''}>
                  <option value="" disabled>Select Team</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg" defaultValue={selectedExpense?.company || ''}>
                  <option value="" disabled>Select Company</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.name}>{company.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <button 
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {modalType === 'newUser' ? 'Add User' : 'Update User'}
                </button>
              </div>
            </form>
          </>
        );
        break;
        
      case 'newCompany':
      case 'editCompany':
        modalContent = (
          <>
            <h3 className="text-lg font-semibold mb-4">
              {modalType === 'newCompany' ? 'Add New Company' : 'Edit Company'}
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
                  placeholder="Company Name" 
                  defaultValue={selectedExpense?.name || ''}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Budget</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
                  placeholder="0.00" 
                  defaultValue={selectedExpense?.monthlyBudget || ''}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <button 
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {modalType === 'newCompany' ? 'Add Company' : 'Update Company'}
                </button>
              </div>
            </form>
          </>
        );
        break;
        
      default:
        modalContent = <p>Modal content not defined</p>;
    }
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
          {modalContent}
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="relative flex-1 overflow-y-auto">
          {/* Notifications dropdown */}
          {showNotifications && (
            <div className="absolute right-4 top-4 w-80 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
              <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h4 className="font-semibold">Notifications</h4>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setShowNotifications(false)}
                >
                  ×
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-3 border-b border-gray-100 ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-2 text-center">
                <button className="text-sm text-indigo-600 hover:text-indigo-800">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
          
          {/* Main content */}
          <main className="p-6">
            {/* Top action bar with tabs */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex">
                <button 
                  className={`px-4 py-2 font-medium ${activeTab === 'dashboard' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  Dashboard
                </button>
                <button 
                  className={`px-4 py-2 font-medium ${activeTab === 'expenses' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                  onClick={() => setActiveTab('expenses')}
                >
                  Expenses
                </button>
                <button 
                  className={`px-4 py-2 font-medium ${activeTab === 'users' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                  onClick={() => setActiveTab('users')}
                >
                  Users
                </button>
                <button 
                  className={`px-4 py-2 font-medium ${activeTab === 'companies' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                  onClick={() => setActiveTab('companies')}
                >
                  Companies
                </button>
                <button 
                  className={`px-4 py-2 font-medium ${activeTab === 'settings' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                  onClick={() => setActiveTab('settings')}
                >
                  Settings
                </button>
              </div>
              
              <div className="flex items-center">
                <div className="relative">
                  <button 
                    className="p-2 rounded-full hover:bg-gray-200 relative"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell size={20} />
                    {notifications.some(n => !n.read) && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Render content based on active tab */}
            {renderTabContent()}
          </main>
        </div>
      </div>
      
      {/* Modal */}
      {renderModal()}
    </div>
  );
}

export default AdminDashboard;