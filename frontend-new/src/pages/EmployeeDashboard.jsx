import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FileText, Plus, Clock, CheckCircle, XCircle, Loader2, X, Upload, Eye, 
  DollarSign, TrendingUp, PieChart as PieIcon, Sliders, Calendar, Edit2 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import Layout from '../components/Layout';

const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#0ea5e9', '#ec4899'];

const EmployeeDashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalSpent: 0,
    monthlySpent: 0,
    monthlyBudget: 2000,
    pieData: [],
    barData: [],
  });
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [newBudgetLimit, setNewBudgetLimit] = useState('');
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingBudget, setIsUpdatingBudget] = useState(false);
  const [formData, setFormData] = useState({
    amount: '', date: '', category: '', project: '', notes: '', receipt: null
  });

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/employee/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
        setExpenses(data.recentExpenses || []);
        setNewBudgetLimit(data.monthlyBudget || 2000);
      }
    } catch (error) {
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return navigate('/login');
    
    const fetchData = async () => {
      try {
        const catRes = await fetch('http://localhost:5000/api/categories', {
           headers: { Authorization: `Bearer ${token}` }
        });
        if (catRes.ok) setCategories(await catRes.json());
      } catch (err) {
        console.error("Failed to load categories", err);
      }
      await fetchDashboardData();
    };
    
    fetchData();
  }, [token, navigate]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'receipt') {
      setFormData({ ...formData, receipt: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmitExpense = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.date || !formData.category) {
      return toast.error("Please fill in all required fields.");
    }
    
    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append('amount', formData.amount);
      data.append('date', formData.date);
      data.append('category', formData.category);
      if (formData.project) data.append('project', formData.project);
      if (formData.notes) data.append('notes', formData.notes);
      if (formData.receipt) data.append('receipt', formData.receipt);

      const res = await fetch('http://localhost:5000/api/expenses/add', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (res.ok) {
        toast.success("Expense submitted successfully!");
        setShowAddModal(false);
        setFormData({ amount: '', date: '', category: '', project: '', notes: '', receipt: null });
        fetchDashboardData();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to submit expense");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBudget = async (e) => {
    e.preventDefault();
    const budgetVal = Number(newBudgetLimit);
    if (!newBudgetLimit || isNaN(budgetVal) || budgetVal < 0) {
      return toast.error("Please enter a valid budget limit.");
    }
    
    try {
      setIsUpdatingBudget(true);
      const res = await fetch('http://localhost:5000/api/employee/budget', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ monthlyBudget: budgetVal }),
      });
      
      if (res.ok) {
        toast.success("Monthly budget limit updated successfully!");
        setShowBudgetModal(false);
        fetchDashboardData();
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to update budget limit");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsUpdatingBudget(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin h-10 w-10 text-primary-600" /></div>;

  const pendingCount = expenses.filter(e => e.status === 'pending').length;
  const approvedCount = expenses.filter(e => e.status === 'approved').length;

  // Monthly budget variables
  const budgetLimit = dashboardData.monthlyBudget || 2000;
  const spentThisMonth = dashboardData.monthlySpent || 0;
  const usedPercentage = Math.min(100, Math.round((spentThisMonth / budgetLimit) * 100));
  const remainingBudget = budgetLimit - spentThisMonth;
  const isOverBudget = remainingBudget < 0;

  let progressColor = "from-emerald-500 to-teal-400";
  if (usedPercentage >= 90) {
    progressColor = "from-rose-500 to-red-400";
  } else if (usedPercentage >= 70) {
    progressColor = "from-amber-500 to-orange-400";
  }

  return (
    <Layout role="employee" title="My Dashboard">
      <div className="animate-fade-in space-y-8">
        {/* Welcome Header */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Welcome back!</h2>
            <p className="text-slate-500 mt-1">Here is a summary of your expense reports and budget.</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center shadow-lg shadow-primary-500/30">
            <Plus className="h-5 w-5 mr-2" />
            New Expense
          </button>
        </div>

        {/* Quick KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 flex items-center">
            <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-500"><FileText className="h-8 w-8" /></div>
            <div className="ml-4">
              <p className="text-slate-500 text-sm font-medium">Total Submitted</p>
              <h4 className="text-2xl font-bold text-slate-800">{expenses.length} Reports</h4>
            </div>
          </div>
          <div className="glass-card p-6 flex items-center">
            <div className="p-4 rounded-2xl bg-amber-50 text-amber-500"><Clock className="h-8 w-8" /></div>
            <div className="ml-4">
              <p className="text-slate-500 text-sm font-medium">Pending Approval</p>
              <h4 className="text-2xl font-bold text-slate-800">{pendingCount} Reports</h4>
            </div>
          </div>
          <div className="glass-card p-6 flex items-center">
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-500"><CheckCircle className="h-8 w-8" /></div>
            <div className="ml-4">
              <p className="text-slate-500 text-sm font-medium">Approved</p>
              <h4 className="text-2xl font-bold text-slate-800">{approvedCount} Reports</h4>
            </div>
          </div>
        </div>

        {/* Budget and Chart Analysis Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Budget Usage Tracker */}
          <div className="glass-card p-6 flex flex-col justify-between border-t-4 border-t-indigo-500">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                  <Sliders className="h-5 w-5 text-indigo-500" />
                  <h3 className="text-lg font-bold text-slate-800">Monthly Budget</h3>
                </div>
                <button 
                  onClick={() => { setNewBudgetLimit(budgetLimit); setShowBudgetModal(true); }} 
                  className="text-xs text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-2.5 py-1.5 rounded-lg font-semibold transition flex items-center"
                >
                  <Edit2 className="h-3 w-3 mr-1" /> Adjust Limit
                </button>
              </div>

              {/* Progress visualizer */}
              <div className="mt-8 space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Spent This Month</p>
                    <p className="text-3xl font-extrabold text-slate-800">${spentThisMonth.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    isOverBudget ? 'bg-rose-100 text-rose-700' :
                    usedPercentage >= 70 ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {usedPercentage}% Used
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                  <div className={`h-full rounded-full bg-gradient-to-r ${progressColor} transition-all duration-500`} style={{ width: `${usedPercentage}%` }}></div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Monthly Limit</span>
                <span className="text-slate-800 font-bold">${budgetLimit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Remaining Budget</span>
                <span className={`font-bold ${isOverBudget ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {isOverBudget ? '-' : ''}${Math.abs(remainingBudget).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </span>
              </div>
              {isOverBudget && (
                <p className="text-xs text-rose-500 bg-rose-50 border border-rose-100 rounded-lg p-2 mt-2 font-medium">
                  ⚠️ You have exceeded your configured budget for this month by ${Math.abs(remainingBudget).toLocaleString()}.
                </p>
              )}
            </div>
          </div>

          {/* Monthly Spend Trend */}
          <div className="glass-card p-6 flex flex-col justify-between lg:col-span-1">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="h-5 w-5 text-primary-500" />
                <h3 className="text-lg font-bold text-slate-800">Monthly Spending Trend</h3>
              </div>
              
              <div className="h-[220px] w-full mt-4">
                {dashboardData.barData && dashboardData.barData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboardData.barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value) => [`$${value}`, 'Spent']} />
                      <Area type="monotone" dataKey="expense" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400 text-sm">No monthly trend data available.</div>
                )}
              </div>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="glass-card p-6 flex flex-col justify-between lg:col-span-1">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <PieIcon className="h-5 w-5 text-emerald-500" />
                <h3 className="text-lg font-bold text-slate-800">Spend by Category</h3>
              </div>

              <div className="h-[220px] w-full mt-4 flex items-center justify-center">
                {dashboardData.pieData && dashboardData.pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData.pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {dashboardData.pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '10px', border: 'none' }} formatter={(value) => [`$${value}`, 'Total Spent']} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400 text-sm">No category distribution data available.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Expenses List */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Expenses</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-sm font-semibold text-slate-500">
                  <th className="py-4 px-4 pl-0">Date</th>
                  <th className="py-4 px-4">Project</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Notes</th>
                  <th className="py-4 px-4">Amount</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {expenses.map((exp) => (
                  <tr key={exp._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 pl-0 text-slate-500">{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="py-4 px-4 font-medium text-slate-700">{exp.project || '-'}</td>
                    <td className="py-4 px-4 font-medium text-slate-600">{exp.category}</td>
                    <td className="py-4 px-4 text-slate-500 max-w-xs truncate">{exp.notes || '-'}</td>
                    <td className="py-4 px-4 font-bold text-slate-800">${exp.amount}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        exp.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        exp.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {exp.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button onClick={() => setSelectedExpense(exp)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition" title="View Details">
                        <Eye className="h-5 w-5 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-500">No expenses submitted yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">Add New Expense</h3>
              <button disabled={isSubmitting} onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitExpense} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($) *</label>
                  <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleInputChange} required className="input-field" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="input-field" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} required className="input-field cursor-pointer">
                    <option value="" disabled>Select category</option>
                    {categories.map((c, i) => (
                      <option key={i} value={c.name || c}>{c.name || c}</option>
                    ))}
                    {categories.length === 0 && <option value="Uncategorized">Uncategorized</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Project Code</label>
                  <input type="text" name="project" value={formData.project} onChange={handleInputChange} className="input-field" placeholder="Optional" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="input-field min-h-[80px] resize-none" placeholder="Reason for expense..."></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Receipt Attachment</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-primary-400 hover:bg-primary-50/50 transition cursor-pointer relative">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600">
                      <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-primary-600 hover:text-primary-500">
                        <span>{formData.receipt ? formData.receipt.name : 'Upload a file'}</span>
                        <input type="file" name="receipt" onChange={handleInputChange} className="sr-only" accept="image/*,.pdf" />
                      </label>
                      {!formData.receipt && <p className="pl-1">or drag and drop</p>}
                    </div>
                    <p className="text-xs text-slate-500">PNG, JPG, PDF up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddModal(false)} disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary px-6 py-2.5 flex items-center shadow-lg shadow-primary-500/30 disabled:opacity-70 disabled:cursor-not-allowed">
                  {isSubmitting && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                  Submit Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Budget Modal */}
      {showBudgetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">Adjust Budget Limit</h3>
              <button disabled={isUpdatingBudget} onClick={() => setShowBudgetModal(false)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateBudget} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Budget Limit ($)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-400 font-semibold">$</span>
                  </div>
                  <input
                    type="number"
                    step="50"
                    value={newBudgetLimit}
                    onChange={(e) => setNewBudgetLimit(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all outline-none"
                    placeholder="2000.00"
                    min="0"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">Set a target budget limit to track your month-to-date spending efficiently.</p>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowBudgetModal(false)} disabled={isUpdatingBudget} className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={isUpdatingBudget} className="btn-primary px-6 py-2.5 flex items-center shadow-lg shadow-primary-500/30 disabled:opacity-75">
                  {isUpdatingBudget && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Details Modal */}
      {selectedExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">Expense Details</h3>
              <button onClick={() => setSelectedExpense(null)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Amount</p>
                  <p className="text-lg font-bold text-slate-800">${selectedExpense.amount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Date</p>
                  <p className="text-slate-700">{new Date(selectedExpense.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Category</p>
                  <p className="text-slate-700">{selectedExpense.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Project</p>
                  <p className="text-slate-700">{selectedExpense.project || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold mt-1 ${
                    selectedExpense.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                    selectedExpense.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedExpense.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-500">Notes</p>
                <p className="text-slate-700 mt-1 bg-slate-50 p-3 rounded-lg border border-slate-100">{selectedExpense.notes || 'No notes provided.'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-500 mb-2">Receipt</p>
                {selectedExpense.receipt ? (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    {selectedExpense.receipt.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                      <img src={`http://localhost:5000/uploads/receipts/${selectedExpense.receipt}`} alt="Receipt" className="w-full h-auto max-h-64 object-contain bg-slate-50" />
                    ) : (
                      <div className="p-4 bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-8 w-8 text-slate-400 mr-3" />
                          <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{selectedExpense.receipt}</span>
                        </div>
                        <a href={`http://localhost:5000/uploads/receipts/${selectedExpense.receipt}`} target="_blank" rel="noreferrer" className="text-sm text-primary-600 hover:text-primary-700 font-medium bg-primary-50 px-3 py-1.5 rounded-md transition">
                          View File
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500 italic text-sm">No receipt attached.</p>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setSelectedExpense(null)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EmployeeDashboard;
