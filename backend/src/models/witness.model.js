const { run } = require("../config/database");

class WitnessesModel {
  static initialized = false;

  table = "witnesses";
  id = -1;
  firstName;
  lastName;
  dateOfBirth;
  contactNumber;
  reportId;
  createdAt = null;

  constructor(firstName, lastName, dateOfBirth, contactNumber, reportId) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.contactNumber = contactNumber;
    this.reportId = reportId;
  }

  async save() {
    await this.initialize();
    return await run(`INSERT INTO ${this.table} (first_name, last_name, date_of_birth, contact_number, report_id) VALUES (?, ?, ?, ?, ?)`, [this.firstName, this.lastName, this.dateOfBirth, this.contactNumber, this.reportId]);
  }

  async findById(id) {
    await this.initialize();
    return await run(`SELECT * FROM ${this.table} WHERE id = ? LIMIT 1`, [id]);
  }

  async initialize() {
    if (WitnessesModel.initialized) {
      return;
    }

    WitnessesModel.initialized = true;

    await run(`CREATE TABLE IF NOT EXISTS ${this.table} (id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT, last_name TEXT, date_of_birth DATE, contact_number TEXT, report_id INTEGER, createdAt DATE DEFAULT current_date)`);
  }
}

module.exports = WitnessesModel;
