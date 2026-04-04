import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend 
} from 'recharts';
import { DollarSign, Clock, CheckCircle, XCircle, Trash2, Tag, Loader2, Eye } from 'lucide-react';
import Layout from '../components/Layout';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

const AdminDashboard = () => {
  const [data, setData] = useState({ expenses: [], users: [], categories: [], monthlyTrend: [] });
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedExpense, setSelectedExpense] = useState(null);
  
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();

  let activeTab = 'overview';
  if (location.pathname === '/admin/users') activeTab = 'users';
  if (location.pathname === '/admin/settings') activeTab = 'settings';
  if (location.pathname === '/admin/expenses') activeTab = 'expenses';

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else if (res.status === 401) {
        navigate('/login');
      }
    } catch (error) {
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return navigate('/login');
    fetchDashboardData();
  }, [token, navigate, fetchDashboardData]);



  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (res.ok) {
        setNewCategoryName('');
        fetchDashboardData();
        toast.success('Category added successfully');
      } else {
        const err = await res.json();
        toast.error(err.message || 'Error adding category');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchDashboardData();
        toast.success('Category deleted');
      }
    } catch (error) {
      toast.error('Network error deleting category');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin h-10 w-10 text-primary-600" />
      </div>
    );
  }

  const { expenses = [], categories = [], users = [], monthlyTrend = [] } = data;

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const pendingCount = expenses.filter(e => e.status === 'pending').length;
  const approvedCount = expenses.filter(e => e.status === 'approved').length;
  const rejectedCount = expenses.filter(e => e.status === 'rejected').length;

  const managers = users.filter((u) => u.role === 'manager');
  const employees = users.filter((u) => u.role === 'employee');

  const ExpenseDetailsModal = () => {
    if (!selectedExpense) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="text-xl font-bold text-slate-800">Expense Details</h3>
            <button onClick={() => setSelectedExpense(null)} className="text-slate-400 hover:text-slate-600 transition"><XCircle className="h-6 w-6" /></button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Employee</p>
                <p className="text-slate-800 font-semibold">{selectedExpense.createdBy?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Amount</p>
                <p className="text-emerald-600 font-bold text-lg">${selectedExpense.amount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Category</p>
                <p className="text-slate-800">{selectedExpense.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Date</p>
                <p className="text-slate-800">{new Date(selectedExpense.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Project</p>
                <p className="text-slate-800">{selectedExpense.project || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Status</p>
                <p className="text-slate-800 capitalize font-medium">{selectedExpense.status}</p>
              </div>
            </div>
            {selectedExpense.notes && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-sm font-medium text-slate-500 mb-1">Notes</p>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg text-sm">{selectedExpense.notes}</p>
              </div>
            )}
             {selectedExpense.receipt && (
               <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                 <a href={selectedExpense.receipt} target="_blank" rel="noreferrer" className="px-4 py-2 bg-primary-50 text-primary-600 font-semibold rounded-lg hover:bg-primary-100 transition">View Receipt ↗</a>
               </div>
             )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout role="admin" title="Admin Overview">


      {activeTab === 'overview' && (
        <div className="animate-fade-in space-y-8">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Total Spent" value={`$${totalExpenses.toLocaleString()}`} icon={DollarSign} color="from-primary-500 to-emerald-400" bgColor="bg-primary-50" iconColor="text-primary-600" />
            <MetricCard title="Pending Approvals" value={pendingCount} icon={Clock} color="from-amber-400 to-orange-400" bgColor="bg-amber-50" iconColor="text-amber-500" />
            <MetricCard title="Approved Claims" value={approvedCount} icon={CheckCircle} color="from-blue-400 to-indigo-400" bgColor="bg-blue-50" iconColor="text-blue-500" />
            <MetricCard title="Rejected Claims" value={rejectedCount} icon={XCircle} color="from-rose-400 to-red-500" bgColor="bg-rose-50" iconColor="text-rose-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 lg:col-span-2">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Monthly Expenditure Trend</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={4} activeDot={{ r: 8, strokeWidth: 0, fill: '#10b981' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Categories Breakdown</h3>
              <div className="h-[300px] flex items-center justify-center">
                {categories.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categories.map((c, i) => ({ name: c.name || c, value: Math.max(1, expenses.filter(e => e.category === (c.name || c)).reduce((sum, e) => sum + e.amount, 0)) }))}
                        cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value"
                      >
                        {categories.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                      <Legend iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-slate-400">No categories found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="animate-fade-in space-y-8">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Managers</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-sm font-semibold text-slate-500">
                    <th className="py-4 px-4 pl-0">Name</th>
                    <th className="py-4 px-4">Email</th>
                    <th className="py-4 px-4">Team</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {managers.map((user) => (
                    <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4 pl-0 font-medium text-slate-700">{user.name}</td>
                      <td className="py-4 px-4 text-slate-500">{user.email}</td>
                      <td className="py-4 px-4 font-semibold text-slate-700">{user.team || 'N/A'}</td>
                    </tr>
                  ))}
                  {managers.length === 0 && (
                    <tr>
                      <td colSpan="3" className="py-8 text-center text-slate-500">No managers found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Employees</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-sm font-semibold text-slate-500">
                    <th className="py-4 px-4 pl-0">Name</th>
                    <th className="py-4 px-4">Email</th>
                    <th className="py-4 px-4">Team</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {employees.map((user) => (
                    <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4 pl-0 font-medium text-slate-700">{user.name}</td>
                      <td className="py-4 px-4 text-slate-500">{user.email}</td>
                      <td className="py-4 px-4 font-semibold text-slate-700">{user.team || 'N/A'}</td>
                    </tr>
                  ))}
                  {employees.length === 0 && (
                    <tr>
                      <td colSpan="3" className="py-8 text-center text-slate-500">No employees found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="animate-fade-in glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Expense Reports</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-sm font-semibold text-slate-500">
                  <th className="py-4 px-4 pl-0">Employee</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Amount</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {expenses.map((exp) => (
                  <tr key={exp._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 pl-0 font-medium text-slate-700">{exp.createdBy?.name || 'Unknown'}</td>
                    <td className="py-4 px-4 text-slate-500">{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-slate-500">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-700">${exp.amount}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        exp.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        exp.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {exp.status.charAt(0).toUpperCase() + exp.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button onClick={() => setSelectedExpense(exp)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition inline-flex justify-center" title="View Details"><Eye className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-500">No expenses recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="animate-fade-in grid md:grid-cols-2 gap-8">
          <div className="glass-card p-8 border-t-4 border-t-primary-500">
            <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center">
              <Tag className="mr-2 h-5 w-5 text-primary-500" />
              Manage Categories
            </h3>
            <p className="text-slate-500 text-sm mb-6">Create or remove expense categories available to employees.</p>
            
            <div className="flex mb-6">
              <input 
                type="text" 
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Ex: Travel, Software..." 
                className="input-field rounded-r-none border-r-0"
              />
              <button onClick={handleAddCategory} className="btn-primary rounded-l-none whitespace-nowrap px-6">
                Add Category
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {categories.map((c, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-slate-200 bg-white/50 group hover:bg-white transition-colors">
                  <span className="font-medium text-slate-700">{c.name || c}</span>
                  <button 
                    onClick={() => handleDeleteCategory(c._id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {categories.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No categories configured.</p>}
            </div>
          </div>
        </div>
      )}

      <ExpenseDetailsModal />
    </Layout>
  );
};

const MetricCard = ({ title, value, icon: Icon, color, bgColor, iconColor }) => (
  <div className="glass-card p-6 relative overflow-hidden group">
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${color} opacity-10 group-hover:scale-150 transition-transform duration-500 ease-out`}></div>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h4 className="text-3xl font-bold text-slate-800">{value}</h4>
      </div>
      <div className={`p-3 rounded-2xl ${bgColor}`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
    </div>
  </div>
);

export default AdminDashboard;
