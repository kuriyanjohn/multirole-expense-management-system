import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router } from 'react-router-dom';
import RouterHandler from './RouterHandler'; // New file

import 'react-toastify/dist/ReactToastify.css';
import './styles/app.css';

const App = () => {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <RouterHandler />
    </Router>
  );
};

export default App;
