const { run } = require("../config/database");

class ReportModel {
  static initialized = false;

  table = "reports";
  id = -1;
  description;
  longitude;
  latitude;
  createdAt = null;

  constructor(description, longitude, latitude) {
    this.description = description;
    this.longitude = longitude;
    this.latitude = latitude;
  }

  async save() {
    await this.initialize();
    return await run(`INSERT INTO ${this.table} (description, longitude, latitude) VALUES (?, ?, ?)`, [this.description, this.longitude, this.latitude]);
  }

  async findById(id) {
    await this.initialize();
    return await run(`SELECT * FROM ${this.table} WHERE id = ? LIMIT 1`, [id]);
  }

  async initialize() {
    if (ReportModel.initialized) {
      return;
    }

    ReportModel.initialized = true;

    await run(`CREATE TABLE IF NOT EXISTS ${this.table} (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, longitude REAL, latitude REAL, createdAt DATE DEFAULT current_date)`);
  }
}

module.exports = ReportModel;
