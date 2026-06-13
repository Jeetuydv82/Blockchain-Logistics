const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'blockchain_logistics_super_secret_key_2024', { expiresIn: '30d' });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { token, role } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const verifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`;
    const response = await fetch(verifyUrl);
    if (!response.ok) {
      return res.status(400).json({ message: 'Invalid Google token' });
    }

    const payload = await response.json();
    const { email, name, email_verified } = payload;

    if (!email_verified) {
      return res.status(400).json({ message: 'Google email is not verified' });
    }

    if (process.env.GOOGLE_CLIENT_ID && payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(400).json({ message: 'Token audience mismatch' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString('hex');
      user = await User.create({
        name: name || 'Google User',
        email,
        password: randomPassword,
        role: role || 'customer'
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.githubLogin = async (req, res) => {
  try {
    const { code, role } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Code is required' });
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      })
    });

    if (!tokenResponse.ok) {
      return res.status(400).json({ message: 'Failed to exchange GitHub authorization code' });
    }

    const tokenData = await tokenResponse.json();
    const access_token = tokenData.access_token;

    if (!access_token) {
      return res.status(400).json({ message: 'No access token returned from GitHub' });
    }

    // Get GitHub profile
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'User-Agent': 'blockchain-logistics'
      }
    });

    if (!userResponse.ok) {
      return res.status(400).json({ message: 'Failed to retrieve GitHub user profile' });
    }

    const githubUser = await userResponse.json();

    // Determine email
    let email = githubUser.email;
    if (!email) {
      const emailsResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'User-Agent': 'blockchain-logistics'
        }
      });
      if (emailsResponse.ok) {
        const emails = await emailsResponse.json();
        const primaryEmail = emails.find(e => e.primary && e.verified) || emails.find(e => e.verified) || emails[0];
        if (primaryEmail) {
          email = primaryEmail.email;
        }
      }
    }

    if (!email) {
      return res.status(400).json({ message: 'GitHub account must have a verified email address' });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString('hex');
      user = await User.create({
        name: githubUser.name || githubUser.login || 'GitHub User',
        email,
        password: randomPassword,
        role: role || 'customer'
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};