const db = require('../config/db.config');
const User = require('../models/user.model');

class UserRepository {
  async findByUsername(username) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      const user = rows[0];
      return new User(user.id, user.username, user.password_hash);
    } catch (error) {
      console.error('Error in findByUsername:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      const user = rows[0];
      return new User(user.id, user.username, user.password_hash);
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  async create(username, passwordHash) {
    try {
      const [result] = await db.execute(
        'INSERT INTO users (username, password_hash) VALUES (?, ?)',
        [username, passwordHash]
      );
      
      return new User(result.insertId, username, passwordHash);
    } catch (error) {
      console.error('Error in create user:', error);
      throw error;
    }
  }
}

module.exports = new UserRepository();
