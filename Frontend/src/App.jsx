import * as jwt_decode from "jwt-decode";
import React, { useState,useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import Sidebar from './components/sidebar';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import ExpenseList from './components/expenseList';
import Login from './components/login';
import Register from './pages/register';

import 'react-toastify/dist/ReactToastify.css';
import './styles/app.css';

const App = () => {
  const [user, setUser] = useState(null);

  // Restore user from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        const now = Date.now() / 1000;
        if (decoded.exp > now) {
          setUser({ id: decoded.id, role: decoded.role });
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
    return children;
  };

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register />} />

        {/* Role-Based Routes */}
        <Route
          path="/AdminDashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <div className="flex h-screen">
                <div className="flex flex-col flex-1">
                  <Header onLogout={() => {
                    setUser(null);
                    localStorage.removeItem("token");
                  }} />
                  <main className="p-4 overflow-y-auto">
                    <AdminDashboard user={user} />
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ManagerDashboard"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <div className="flex h-screen">
                <div className="flex flex-col flex-1">
                  <Header onLogout={() => {
                    setUser(null);
                    localStorage.removeItem("token");
                  }} />
                  <main className="p-4 overflow-y-auto">
                    <ManagerDashboard user={user} />
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/EmployeeDashboard"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <div className="flex h-screen">
                <div className="flex flex-col flex-1">
                  <Header onLogout={() => {
                    setUser(null);
                    localStorage.removeItem("token");
                  }} />
                  <main className="p-4 overflow-y-auto">
                    <EmployeeDashboard user={user} />
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
