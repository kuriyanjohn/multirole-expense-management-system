import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Mail, Lock, ArrowRight, ShieldCheck, Briefcase } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'employee' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Registration successful! Please login.');
        navigate('/login');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('Network error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden py-10">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary-200/50 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/50 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-3xl shadow-[0_20px_50px_rgb(0,0,0,0.06)] overflow-hidden z-10 m-4 sm:m-8">
        
        {/* Left Side - Register Form */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center order-2 md:order-1">
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Create an account</h2>
            <p className="text-slate-500 mb-8">Join your team to manage expenses efficiently.</p>

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all outline-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all outline-none"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-slate-400" />
                  </div>
                  <select
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all outline-none appearance-none"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-4 mt-2 border border-transparent rounded-xl shadow-md shadow-primary-500/20 text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all font-medium active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? 'Creating account...' : 'Create Account'}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition">
                Sign in
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Brand Banner */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-tr from-slate-900 to-slate-800 text-white relative overflow-hidden order-1 md:order-2">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          
          <div className="relative z-10 flex justify-end">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold tracking-tight">Acme Spend</span>
              <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl">
                <ShieldCheck size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-10">
            <h1 className="text-4xl font-bold mb-4 leading-tight">Start managing<br/>expenses intelligently.</h1>
            <ul className="space-y-4 mt-8 text-slate-300">
              <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-3"></div> Upload receipts instantly</li>
              <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-3"></div> Automated approval workflows</li>
              <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-3"></div> Real-time budget tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
