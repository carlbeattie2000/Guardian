const { run } = require("../config/database");

class TwoFactorCodesModel {
  static initialized = false;

  table = "two_factor_auth_codes";
  id = -1;
  user_id;
  code;
  expiresAt;
  createdAt = null;

  constructor(user_id, code, expiresAt) {
    this.user_id = user_id;
    this.code = code;
    this.expiresAt = expiresAt;
  }

  async save() {
    await this.initialize();
    return await run(`INSERT INTO ${this.table} (user_id, code, expiresAt) VALUES (?, ?, ?)`, [this.user_id, this.code, this.expiresAt]);
  }

  async findById(id) {
    await this.initialize();
    return await run(`SELECT * FROM ${this.table} WHERE id = ? LIMIT 1`, [id]);
  }

  async initialize() {
    if (TwoFactorCodesModel.initialized) {
      return;
    }

    TwoFactorCodesModel.initialized = true;

    await run(`CREATE TABLE IF NOT EXISTS ${this.table} (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, code TEXT, expiresAt TEXT, createdAt DATE DEFAULT current_date)`);
  }
}

module.exports = TwoFactorCodesModel;
