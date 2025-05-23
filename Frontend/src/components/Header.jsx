import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } catch (err) {
        console.warn('Logout request error (probably safe to ignore if not using backend logout):', err);
      }
  
      localStorage.removeItem('token');
      onLogout();                       
      navigate('/login');             
    }
  };
  

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Expense Management</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
