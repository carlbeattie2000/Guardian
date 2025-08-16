const personalDetailsService = require("../services/personalDetails/personalDetails.service");
const reportsService = require("../services/reports/reports.service");
const authenticationService = require("../services/users/authentication.service");
const HttpError = require("../utils/httpError");

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

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getAll(req, res) {
    const reports = await reportsService.getAll();

    return res.status(reports.code).json(reports);
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async createWitness(req, res) {
    const id = req.params.id;
    const canModifyReport = await reportsService.canModifyReport(id, req.user);

    if (!canModifyReport) {
      throw new HttpError({ code: 401 });
    }

    const createWitnessRes = await personalDetailsService.createReportWitness(
      req.body,
      id,
    );

    return res.status(createWitnessRes.code).json(createWitnessRes);
  }
}

const reportsController = new ReportsController();

module.exports = reportsController;
