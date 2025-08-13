const { run } = require("../config/database");

class LostItemModel {
  static initialized = false;

  table = "lost_items";
  id = -1;
  personalDetailsId;
  name;
  description;
  serialNumber;
  color;
  model;
  createdAt = null;

  constructor(personalDetailsId, name, description, serialNumber, color, model) {
    this.personalDetailsId = personalDetailsId;
    this.name = name;
    this.description = description;
    this.serialNumber = serialNumber;
    this.color = color;
    this.model = model;
  }

  async save() {
    await this.initialize();
    return await run(`INSERT INTO ${this.table} (personal_details_id, name, description, serialNumber, color, model) VALUES (?, ?, ?, ?, ?, ?)`, [this.personalDetailsId, this.name, this.description, this.serialNumber, this.color, this.model]);
  }

  async findById(id) {
    await this.initialize();
    return await run(`SELECT * FROM ${this.table} WHERE id = ? LIMIT 1`, [id]);
  }

  async initialize() {
    if (LostItemModel.initialized) {
      return;
    }

    LostItemModel.initialized = true;

    await run(`CREATE TABLE IF NOT EXISTS ${this.table} (id INTEGER PRIMARY KEY AUTOINCREMENT, personal_details_id INTEGER, name TEXT, description TEXT, serialNumber TEXT, color TEXT, model TEXT, createdAt DATE DEFAULT current_date)`);
  }
}

module.exports = LostItemModel;
