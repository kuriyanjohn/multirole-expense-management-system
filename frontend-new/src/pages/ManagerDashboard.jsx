import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FileText, Users, DollarSign, Loader2, XCircle, Eye } from 'lucide-react';
import Layout from '../components/Layout';

const ManagerDashboard = () => {
  const [teamExpenses, setTeamExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
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
                    <td className="py-4 px-4 text-right space-x-2 flex items-center justify-end">
                      <button onClick={() => setSelectedExpense(exp)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition" title="View Details"><Eye className="w-5 h-5" /></button>
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

        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">All Team Expenses</h3>
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
                {teamExpenses.map((exp) => (
                  <tr key={`all-${exp._id}`} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 pl-0 font-medium text-slate-700">{exp.createdBy?.name || 'Unknown'}</td>
                    <td className="py-4 px-4 text-slate-500">{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-slate-500"><span className="px-2 py-1 bg-slate-100 rounded-md text-xs">{exp.category}</span></td>
                    <td className="py-4 px-4 font-bold text-slate-800">${exp.amount}</td>
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
                {teamExpenses.length === 0 && (
                  <tr><td colSpan="6" className="py-8 text-center text-slate-500">No team expenses found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
      <ExpenseDetailsModal />
    </Layout>
  );
};

export default ManagerDashboard;
