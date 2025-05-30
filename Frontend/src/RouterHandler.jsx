import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import {jwtDecode } from 'jwt-decode';

import Header from './components/Header';
import Sidebar from './components/sidebar';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import ExpenseList from './components/expenseList';
import Login from './components/login';
import Register from './pages/register';

const RouterHandler = () => {
  const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log('tokenn',token);
    
    if (token) {
      try {
        const decoded = jwtDecode (token);
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
    // setLoading(false)
  }, []);

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if(!loading) return null
    if (!user) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
    return children;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={setUser} />} />
      <Route path="/register" element={<Register />} />

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

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default RouterHandler;
