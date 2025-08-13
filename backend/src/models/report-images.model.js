const { run } = require("../config/database");

class ReportImagesModel {
  static initialized = false;

  table = "report_images";
  id = -1;
  reportId;
  imagePath;
  createdAt = null;

  constructor(reportId, imagePath) {
    this.reportId = reportId;
    this.imagePath = imagePath;
  }

  async save() {
    await this.initialize();
    return await run(`INSERT INTO ${this.table} (report_id, image_path) VALUES (?, ?)`, [this.reportId, this.imagePath]);
  }

  async findById(id) {
    await this.initialize();
    return await run(`SELECT * FROM ${this.table} WHERE id = ? LIMIT 1`, [id]);
  }

  async initialize() {
    if (ReportImagesModel.initialized) {
      return;
    }

    ReportImagesModel.initialized = true;

    await run(`CREATE TABLE IF NOT EXISTS ${this.table} (id INTEGER PRIMARY KEY AUTOINCREMENT, report_id INTEGER, image_path TEXT, createdAt DATE DEFAULT current_date)`);
  }
}

module.exports = ReportImagesModel;
