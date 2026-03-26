import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FileText, Users, DollarSign, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';

const ManagerDashboard = () => {
  const [teamExpenses, setTeamExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return navigate('/login');
    fetchTeamExpenses();
  }, [token, navigate]);

  const fetchTeamExpenses = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/manager/expenses/team', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setTeamExpenses(await res.json());
    } catch (error) {
      toast.error('Failed to load team expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/manager/expenses/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Expense ${status}`);
        fetchTeamExpenses();
      }
    } catch (error) {
      toast.error('Action failed');
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary-600" /></div>;

  const pendingReviews = teamExpenses.filter(e => e.status === 'pending');

  return (
    <Layout role="manager" title="Manager Dashboard">
      <div className="animate-fade-in space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 flex items-center justify-between border-l-4 border-amber-400 cursor-pointer hover:shadow-lg transition">
            <div>
              <p className="text-slate-500 font-medium">Action Required</p>
              <h4 className="text-2xl font-bold text-slate-800">{pendingReviews.length} Pending Approvals</h4>
            </div>
            <div className="p-4 rounded-full bg-amber-50"><FileText className="h-6 w-6 text-amber-500" /></div>
          </div>
          <div className="glass-card p-6 flex items-center justify-between border-l-4 border-indigo-400">
            <div>
              <p className="text-slate-500 font-medium">Team Expenses</p>
              <h4 className="text-2xl font-bold text-slate-800">${teamExpenses.reduce((s, e) => s + e.amount, 0).toLocaleString()} Total</h4>
            </div>
            <div className="p-4 rounded-full bg-indigo-50"><DollarSign className="h-6 w-6 text-indigo-500" /></div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Needs Review</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-sm font-semibold text-slate-500">
                  <th className="py-4 px-4 pl-0">Employee</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Amount</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {pendingReviews.map((exp) => (
                  <tr key={exp._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 pl-0 font-medium text-slate-700">{exp.createdBy?.name || 'Team Member'}</td>
                    <td className="py-4 px-4 text-slate-500">{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-slate-500"><span className="px-2 py-1 bg-slate-100 rounded-md text-xs">{exp.category}</span></td>
                    <td className="py-4 px-4 font-bold text-slate-800">${exp.amount}</td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button onClick={() => handleAction(exp._id, 'approved')} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-semibold rounded-lg text-xs transition">Approve</button>
                      <button onClick={() => handleAction(exp._id, 'rejected')} className="px-3 py-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 font-semibold rounded-lg text-xs transition">Reject</button>
                    </td>
                  </tr>
                ))}
                {pendingReviews.length === 0 && (
                  <tr><td colSpan="5" className="py-8 text-center text-slate-500">No expenses currently need review. You're fully caught up! 🎉</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManagerDashboard;
