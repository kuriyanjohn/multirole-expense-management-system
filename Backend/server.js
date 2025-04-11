require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
// const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db.js'); // MongoDB connection
const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes.js');


// ================== Middleware ================== //

// Security Headers
// app.use(helmet());

// Enable CORS (customize origin as needed)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/auth', limiter); // apply to auth routes

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie Parser (for JWT stored in cookie if needed)
app.use(cookieParser());

// ================== Routes ================== //
app.use('/api/auth', authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use('/api/employee', require('./routes/employeeRoutes'));
app.use('/api/manager', require('./routes/managerRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));


// ================== Error Handler ================== //
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Failed to connect to DB:', err);
});
