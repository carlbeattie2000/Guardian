const { run } = require("../config/database");

class AIReportAnalytics {
  static initialized = false;

  table = "ai_report_analytics";
  id = -1;
  reportId;
  threatLevel;
  createdAt = null;

  constructor(reportId, threatLevel) {
    this.reportId = reportId;
    this.threatLevel = threatLevel;
  }

  async save() {
    await this.initialize();
    return await run(`INSERT INTO ${this.table} (report_id, threat_level) VALUES (?, ?)`, [this.reportId, this.threatLevel]);
  }

  async findById(id) {
    await this.initialize();
    return await run(`SELECT * FROM ${this.table} WHERE id = ? LIMIT 1`, [id]);
  }

  async initialize() {
    if (AIReportAnalytics.initialized) {
      return;
    }

    AIReportAnalytics.initialized = true;

    await run(`CREATE TABLE IF NOT EXISTS ${this.table} (id INTEGER PRIMARY KEY AUTOINCREMENT, report_id INTEGER, threat_level TEXT, createdAt DATE DEFAULT current_date)`);
  }
}

module.exports = AIReportAnalytics;
