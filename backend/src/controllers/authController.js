const jwt = require('jsonwebtoken');
const { StockUser } = require('../models');

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await StockUser.findOne({ where: { email } });

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role
        },
        token
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async register(req, res) {
    try {
      const { email, password, full_name } = req.body;
      
      const existingUser = await StockUser.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const user = await StockUser.create({
        email,
        password_hash: password,
        full_name
      });

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role
        },
        token
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = new AuthController(); 