const db = require("../config/db.config");
const User = require("../models/user.model");

class UserRepository {
  async findByUsername(username) {
    try {
      const result = await db.query("SELECT * FROM users WHERE username = $1", [
        username,
      ]);

      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0];
      return new User(user.id, user.username, user.password_hash);
    } catch (error) {
      console.error("Error in findByUsername:", error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);

      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0];
      return new User(user.id, user.username, user.password_hash);
    } catch (error) {
      console.error("Error in findById:", error);
      throw error;
    }
  }

  async create(username, passwordHash) {
    try {
      const result = await db.query(
        "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id",
        [username, passwordHash]
      );

      return new User(result.rows[0].id, username, passwordHash);
    } catch (error) {
      console.error("Error in create user:", error);
      throw error;
    }
  }
}

module.exports = new UserRepository();
