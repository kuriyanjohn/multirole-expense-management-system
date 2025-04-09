require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');


const connectDB = require('./config/db.js'); // MongoDB connection
const authRoutes = require('./routes/authRoutes');
// const expenseRoutes = require('./routes/expenseRoutes.js');
// Import other routes as needed

const app = express();
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

// File Upload (for receipts)
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  abortOnLimit: true,
  safeFileNames: true,
  preserveExtension: true,
}));

// ================== Routes ================== //
app.use('/api/auth', authRoutes);
// app.use('/api/expenses', expenseRoutes);
// Add budgetRoutes, userRoutes, notificationRoutes, etc.

// ================== Error Handler ================== //
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// ================== Database & Server Init ================== //
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Failed to connect to DB:', err);
});
