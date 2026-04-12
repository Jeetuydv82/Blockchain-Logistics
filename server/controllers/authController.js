// server/controllers/authController.js
const User = require('../models/User');
const jwt  = require('jsonwebtoken');

// ─── GENERATE JWT TOKEN ────────────────────────────────
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// ─── REGISTER ──────────────────────────────────────────
// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success : false,
        message : 'User already exists with this email'
      });
    }

    // Create new user
    const user = await User.create({ name, email, password, role });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success : true,
      message : 'User registered successfully',
      token,
      user    : {
        id    : user._id,
        name  : user.name,
        email : user.email,
        role  : user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      success : false,
      message : error.message
    });
  }
};

// ─── LOGIN ─────────────────────────────────────────────
// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password provided
    if (!email || !password) {
      return res.status(400).json({
        success : false,
        message : 'Please provide email and password'
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success : false,
        message : 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success : false,
        message : 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success : true,
      message : 'Login successful',
      token,
      user    : {
        id    : user._id,
        name  : user.name,
        email : user.email,
        role  : user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      success : false,
      message : error.message
    });
  }
};

// ─── GET CURRENT USER ──────────────────────────────────
// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success : true,
      user    : {
        id        : user._id,
        name      : user.name,
        email     : user.email,
        role      : user.role,
        createdAt : user.createdAt
      }
    });

  } catch (error) {
    res.status(500).json({
      success : false,
      message : error.message
    });
  }
};

module.exports = { register, login, getMe };