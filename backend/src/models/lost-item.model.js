const BaseModel = require("./base.model");

class LostItemModel extends BaseModel {
  static table = "lost_items";
  static schema = `CREATE TABLE IF NOT EXISTS ${this.table} (id INTEGER PRIMARY KEY AUTOINCREMENT, personal_details_id INTEGER, name TEXT, description TEXT, serial_number TEXT, color TEXT, model TEXT, created_at DATE DEFAULT current_date)`;

  personal_details_id;
  name;
  description;
  serial_number;
  color;
  model;
  created_at = null;

  constructor(personalDetailsId, name, description, serialNumber, color, model) {
    super();

    this.personal_details_id = personalDetailsId;
    this.name = name;
    this.description = description;
    this.serial_number = serialNumber;
    this.color = color;
    this.model = model;
  }
}

LostItemModel.initialize();

module.exports = LostItemModel;
