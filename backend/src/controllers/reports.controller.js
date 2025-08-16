const reportsService = require("../services/reports/reports.service");

class ReportsController {
  /**
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  async createReport(req, res) {
    const createReportRes = await reportsService.createReport(
      req.files,
      req.body,
    );

    res.status(createReportRes.code).json(createReportRes);
  }

  /**
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  async getReportById(req, res) {
    const id = req.params.id;
    const report = await reportsService.getReportById(id);

    res.status(report.code).json(report);
  }
}

const reportsController = new ReportsController();

module.exports = reportsController;
