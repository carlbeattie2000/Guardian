const BaseModel = require("./base.model");

class ReportModel extends BaseModel {
  static table = "reports";
  static schema = `CREATE TABLE IF NOT EXISTS ${this.table} (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, longitude REAL, latitude REAL, user_id INTEGER, status TEXT DEFAULT "PENDING", createdAt DATE DEFAULT current_date)`;
  description;
  longitude;
  latitude;
  user_id;
  status;
  createdAt = null;

  constructor(description, longitude, latitude, user_id, status) {
    super();

    this.description = description;
    this.longitude = longitude;
    this.latitude = latitude;
    this.user_id = user_id;
    this.status = status;
  }
}

ReportModel.initialize();

module.exports = ReportModel;
