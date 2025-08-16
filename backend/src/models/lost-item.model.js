const BaseModel = require("./base.model");

class LostItemModel extends BaseModel {
  static table = "lost_items";
  static schema = `CREATE TABLE IF NOT EXISTS ${this.table} (id INTEGER PRIMARY KEY AUTOINCREMENT, personal_details_id INTEGER DEFAULT -1, name TEXT, description TEXT, serial_number TEXT, color TEXT, model TEXT, found INTEGER DEFAULT 0, user_id INTEGER, created_at DATE DEFAULT current_date)`;

  personal_details_id;
  name;
  description;
  serial_number;
  color;
  model;
  user_id;
  created_at = null;

  constructor(name, description, serialNumber, color, model, user_id) {
    super();

    this.name = name;
    this.description = description;
    this.serial_number = serialNumber;
    this.color = color;
    this.model = model;
    this.user_id = user_id;
  }
}

LostItemModel.initialize();

module.exports = LostItemModel;
