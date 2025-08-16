const reportsService = require("../services/reports/reports.service");
const authenticationService = require("../services/users/authentication.service");

class ReportsController {
  /**
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  async createReport(req, res) {
    const createReportRes = await reportsService.createReport(
      req.files,
      req.body,
      req.user,
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

    if (report.error || report.data === null) {
      return res.status(report.code).json(report);
    }

    if (!(await reportsService.canUserViewReport(report.data, req.user))) {
      return res.sendStatus(401);
    }

    res.status(report.code).json(report);
  }
}

const reportsController = new ReportsController();

module.exports = reportsController;
