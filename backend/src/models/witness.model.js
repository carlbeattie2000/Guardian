const BaseModel = require("./base.model");

class WitnessesModel extends BaseModel {
  static table = "witnesses";
  static schema = ```CREATE TABLE IF NOT EXISTS ${this.table} (id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT, last_name TEXT, date_of_birth DATE, contact_number TEXT, report_id INTEGER, created_at DATE DEFAULT current_date)`;

  first_name;
  last_name;
  date_of_birth;
  contact_number;
  report_id;
  created_at;

  constructor(firstName, lastName, dateOfBirth, contactNumber, reportId) {
    super();

    this.first_name = firstName;
    this.last_name = lastName;
    this.date_of_birth = dateOfBirth;
    this.contact_number = contactNumber;
    this.report_id = reportId;
  }
}

WitnessesModel.initialize();

module.exports = WitnessesModel;
