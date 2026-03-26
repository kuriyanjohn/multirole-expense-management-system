import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, ArrowRight, ShieldCheck, Briefcase } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        toast.success('Successfully logged in!');
        if (data.user.role === 'admin') navigate('/admin');
        else if (data.user.role === 'manager') navigate('/manager');
        else navigate('/employee');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      toast.error('Network error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-200/50 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/50 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-3xl shadow-[0_20px_50px_rgb(0,0,0,0.06)] overflow-hidden z-10 m-4 sm:m-8">
        {/* Left Side - Brand Banner */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-primary-600 to-primary-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full border-4 border-white/10"></div>
          <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full border-4 border-white/10"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-10">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <ShieldCheck size={32} className="text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">Acme Spend</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">Master your<br/>company expenses.</h1>
            <p className="text-primary-100 text-lg">The multi-role expense management system designed for transparency and speed.</p>
          </div>
          
          <div className="relative z-10 mt-20">
            <p className="text-sm font-medium text-primary-200">"Streamlined our entire accounting process by 80%."</p>
            <div className="flex items-center mt-3">
              <div className="w-10 h-10 rounded-full bg-primary-400 flex items-center justify-center text-sm font-bold">JD</div>
              <div className="ml-3">
                <p className="text-sm font-semibold">Jane Doe</p>
                <p className="text-xs text-primary-200">Finance Director, TechCorp</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome back</h2>
            <p className="text-slate-500 mb-8">Please enter your details to sign in.</p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
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
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">Forgot password?</a>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-primary-500/20 text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all font-medium active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? 'Authenticating...' : 'Sign in'}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 transition">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
