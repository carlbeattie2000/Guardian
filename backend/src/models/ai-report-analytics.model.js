const BaseModel = require("./base.model");

class AIReportAnalytics extends BaseModel {
  static table = "ai_report_analytics";
  static schema = `CREATE TABLE IF NOT EXISTS ${this.table} (id INTEGER PRIMARY KEY AUTOINCREMENT, report_id INTEGER, threat_level TEXT, created_at DATE DEFAULT current_date)`;

  report_id;
  threat_level;
  created_at = null;

  constructor(reportId, threatLevel) {
    super();

    this.report_id = reportId;
    this.threat_level = threatLevel;
  }
}

AIReportAnalytics.initialize();

module.exports = AIReportAnalytics;
