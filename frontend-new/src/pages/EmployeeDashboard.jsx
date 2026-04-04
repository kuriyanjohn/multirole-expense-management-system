import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FileText, Plus, Clock, CheckCircle, XCircle, Loader2, X, Upload } from 'lucide-react';
import Layout from '../components/Layout';

const EmployeeDashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: '', date: '', category: '', project: '', notes: '', receipt: null
  });

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/employee/expenses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setExpenses(await res.json());
    } catch (error) {
      toast.error('Failed to load expenses');
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
      await fetchExpenses();
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
        fetchExpenses();
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

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary-600" /></div>;

  const pendingCount = expenses.filter(e => e.status === 'pending').length;
  const approvedCount = expenses.filter(e => e.status === 'approved').length;

  return (
    <Layout role="employee" title="My Dashboard">
      <div className="animate-fade-in space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Welcome back!</h2>
            <p className="text-slate-500 mt-1">Here is a summary of your expense reports.</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center shadow-lg shadow-primary-500/30">
            <Plus className="h-5 w-5 mr-2" />
            New Expense
          </button>
        </div>

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
                  <th className="py-4 px-4 text-right">Status</th>
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
                    <td className="py-4 px-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        exp.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        exp.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {exp.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-500">No expenses submitted yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
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
    </Layout>
  );
};

export default EmployeeDashboard;
