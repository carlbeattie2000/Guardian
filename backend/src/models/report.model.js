const BaseModel = require("./base.model");

class ReportModel extends BaseModel {
  static table = 'reports';
  static schema = `CREATE TABLE IF NOT EXISTS ${this.table} (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, longitude REAL, latitude REAL, createdAt DATE DEFAULT current_date)`;

  description;
  longitude;
  latitude;
  createdAt = null;

  constructor(description, longitude, latitude) {
    super();

    this.description = description;
    this.longitude = longitude;
    this.latitude = latitude;
  }
}

ReportModel.initialize();

module.exports = ReportModel;
