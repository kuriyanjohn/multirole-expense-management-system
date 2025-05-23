const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  console.log('Entering protect middleware');
  let token;
  
  try {
  const authHeader = req.headers.authorization;
  if (authHeader) {
  token = authHeader.startsWith('Bearer') 
    ? authHeader.split(' ')[1]
    : authHeader;
}
  console.log('token',token);
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;  
    console.log('Authenticated user:', req.user);
    next();
  } catch (err) {
    console.log('Token error:', err.message);
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

const authorizeRoles = (...roles) => {
  console.log('authorizerole function',roles);
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
