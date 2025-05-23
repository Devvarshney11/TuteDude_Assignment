const authService = require('../services/auth.service');

class AuthController {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      const result = await authService.login(username, password);
      
      if (!result.success) {
        return res.status(401).json({ message: result.message });
      }
      
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in login controller:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async register(req, res) {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }
      
      const result = await authService.register(username, password);
      
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }
      
      return res.status(201).json(result);
    } catch (error) {
      console.error('Error in register controller:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = new AuthController();
