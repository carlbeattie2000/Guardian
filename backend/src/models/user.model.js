const argon2 = require('argon2');
const BaseModel = require("./base.model");

class UserModel extends BaseModel {
  static table = 'users';
  static schema = `CREATE TABLE IF NOT EXISTS ${this.table} (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, email TEXT UNIQUE, password TEXT, is_officer INTEGER, created_at DEFAULT current_date)`;

  username;
  email;
  password;
  is_officer;
  created_at = null;

  constructor(username, email, password, isOfficer) {
    super();

    this.username = username;
    this.email = email;
    this.password = password;
    this.is_officer = isOfficer;
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
    await this.hashPassword()
    return await super.save();
  }
}

UserModel.initialize();

module.exports = UserModel;
