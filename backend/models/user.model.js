class User {
  constructor(id, username, passwordHash) {
    this.id = id;
    this.username = username;
    this.passwordHash = passwordHash;
  }
}

module.exports = User;
