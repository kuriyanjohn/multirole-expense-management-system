import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FileText, Plus, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';

const EmployeeDashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return navigate('/login');
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
    fetchExpenses();
  }, [token, navigate]);

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
          <button className="btn-primary flex items-center shadow-lg shadow-primary-500/30">
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
                    <td className="py-4 px-4 font-medium text-slate-700">{exp.category}</td>
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
                    <td colSpan="5" className="py-8 text-center text-slate-500">No expenses submitted yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeDashboard;
