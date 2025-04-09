const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const Joi = require('joi');

const register = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'manager', 'employee')
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password, role });
  const token = generateToken(user);

  res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
};

const login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid email or password' });

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

  const token = generateToken(user);
  res.status(200).json({ user: { 
    id: user._id, 
    name: user.name, 
    email: user.email, 
    role: user.role }, 
    token,
    redirectTo: getDashboardRoute(user.role),
   });
};
const getDashboardRoute = (role) => {
  switch (role) {
    case 'admin':
      return '/AdminDashboard';
    case 'manager':
      return '/ManagerDashboard';
    case 'employee':
      return '/EmployeeDashboard';
    default:
      return '/';
  }
};

module.exports = { 
  register,
  login
 };
