const { run } = require("../config/database");
const argon2 = require('argon2');

class UserModel {
  static initialized = false;

  table = "users";
  id = -1;
  username;
  email;
  password;
  isOfficer;
  createdAt = null;
  error = null;

  constructor(username, email, password, isOfficer) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.isOfficer = isOfficer;

    this.initialize();
  }

  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  async verifyPassword(password) {
    try {
      if (await argon2.verify(this.password, password))
        return true;

      return false;
    } catch {
      return false;
    }
  }

  async save() {
    try {
      await this.hashPassword()
      return await run(`INSERT INTO ${this.table} (username, email, password, isOfficer) VALUES (?, ?, ?, ?)`, [this.username, this.email, this.password, this.isOfficer]);
    } catch (err) {
      this.error = err;
      return this;
    }
  }

  static async findById(id) {
    return await run(`SELECT * FROM ${this.table} WHERE id = ? LIMIT 1`, [id]);
  }

  static async findByUsername(username) {
    return await run(`SELECT * FROM ${this.table} WHERE username = ? LIMIT 1`, [username]);
  }

  async initialize() {
    if (UserModel.initialized) {
      return;
    }

    UserModel.initialized = true;

    await run(`CREATE TABLE IF NOT EXISTS ${this.table} (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, password TEXT, isOfficer INTEGER, createdAt DATE DEFAULT current_date, UNIQUE(username, email))`);
  }
}

module.exports = UserModel;
