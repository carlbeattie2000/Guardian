const personalDetailsService = require("../services/personalDetails/personalDetails.service");
const reportsService = require("../services/reports/reports.service");
const authenticationService = require("../services/users/authentication.service");
const HttpError = require("../utils/httpError");
const HttpResponse = require("../utils/HttpResponseHelper");

class ReportsController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async create(req, res) {
    const createReportRes = await reportsService.create(
      req.files,
      req.body,
      req.user,
    );

    new HttpResponse(createReportRes.code, createReportRes.data).json(res);
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getById(req, res) {
    const id = req.params.id;
    const report = await reportsService.getById(id);

    if (report.error || report.data === null) {
      return new HttpResponse(401).sendStatus(res);
    }

    if (!(await reportsService.canUserView(report.data, req.user))) {
      return new HttpResponse(401).sendStatus(res);
    }

    new HttpResponse(report.code, report.data).json(res);
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getAll(req, res) {
    const reports = await reportsService.getAll();

    new HttpResponse(reports.code, reports.data).json(res);
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async createWitness(req, res) {
    const id = req.params.id;
    const canModifyReport = await reportsService.canModify(id, req.user);

    if (!canModifyReport) {
      throw new HttpError({ code: 401 });
    }

    const createWitnessRes = await personalDetailsService.createReportWitness(
      req.body,
      id,
    );

    new HttpResponse(createWitnessRes.code, createWitnessRes.data).json(res);
  }
}

const reportsController = new ReportsController();

module.exports = reportsController;
