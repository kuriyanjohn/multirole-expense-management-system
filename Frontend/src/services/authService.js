import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`; 

const registerUser = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/register`, userData);
    return res.data;
  } catch (err) {
    console.log(err);
    
    throw err.response?.data?.message || 'Registration failed';
  }
};

const loginUser = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/login`, userData);
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || 'Login failed';
  }
};

// ✅ Exporting an object with default export
const authService = {
  registerUser,
  loginUser,
};

export default authService;
