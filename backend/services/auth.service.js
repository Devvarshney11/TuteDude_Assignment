const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');

class AuthService {
  async login(username, password) {
    try {
      // Find user by username
      const user = await userRepository.findByUsername(username);
      
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      
      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      
      if (!isPasswordValid) {
        return { success: false, message: 'Invalid password' };
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      
      return {
        success: true,
        user: {
          id: user.id,
          username: user.username
        },
        token
      };
    } catch (error) {
      console.error('Error in login service:', error);
      throw error;
    }
  }

  async register(username, password) {
    try {
      // Check if user already exists
      const existingUser = await userRepository.findByUsername(username);
      
      if (existingUser) {
        return { success: false, message: 'Username already exists' };
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      
      // Create new user
      const newUser = await userRepository.create(username, passwordHash);
      
      // Generate JWT token
      const token = jwt.sign(
        { id: newUser.id, username: newUser.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      
      return {
        success: true,
        user: {
          id: newUser.id,
          username: newUser.username
        },
        token
      };
    } catch (error) {
      console.error('Error in register service:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();
