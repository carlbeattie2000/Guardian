const z = require("zod");
const ReportModel = require("../models/report.model");
const FileStorage = require("../lib/file-storage");
const ReportImagesModel = require("../models/report-images.model");
const UserModel = require("../models/user.model");
const personalDetailsService = require("./personal-details.service");
const HttpError = require("../utils/http-error");
const {
  calculateReportPriorityFromDescription,
} = require("../utils/word-priority-matching");

class ReportsService {
  ReportValidation = z.object({
    description: z.string(),
    longitude: z.preprocess((val) => Number(val), z.number()).optional(),
    latitude: z.preprocess((val) => Number(val), z.number()).optional(),
  });

  UpdateStatusValidation = z.object({
    status: z.enum(["PENDING", "IN-PROGRESS", "COMPLETED", "CLOSED"]),
  });

  /**
   * @returns {Promise<ReportModel>}
   */
  async create(files, body, user_id) {
    const reportDetailsValidated = this.ReportValidation.parse(body);
    const report = new ReportModel(
      reportDetailsValidated.description,
      reportDetailsValidated.longitude,
      reportDetailsValidated.latitude,
      user_id,
      calculateReportPriorityFromDescription(
        reportDetailsValidated.description,
      ),
    );

    await report.save();

    const imageNames = [];

    if (Array.isArray(files) && files.length > 0) {
      for (const file of files) {
        const fileName = await FileStorage.saveImage(file);
        imageNames.push(fileName);

        new ReportImagesModel(report.id, fileName).save();
      }
    }

    return report;
  }

  /**
   * @param {number} id
   * @return {Promise<ReportModel | null>}
   */
  async getById(id) {
    const report = await ReportModel.findById(id);

    if (report === null) {
      return null;
    }

    const personalDetails = await personalDetailsService.findByReportId(id);

    report.personal_details = personalDetails;

    const imagePaths = await ReportImagesModel.findAllBy(
      "report_id",
      report.id,
    );

    report.images = imagePaths;

    return report;
  }

  /**
   * @param {number} id
   * @param {number} user_id
   * @param {boolean} [is_officer=false]
   */
  async canModify(id, user_id, is_officer = false) {
    if (is_officer) {
      return true;
    }

    const report = await ReportModel.findById(id);

    if (report && report.user_id === user_id) {
      return true;
    }
  }

  /**
   * @param {unknown} report
   * @param {number} user_id
   */
  async canUserView(report, user_id) {
    const user = await UserModel.findById(user_id);

    if (user === null) {
      return false;
    }

    return user.is_officer || report.user_id === user_id;
  }

  /**
   * @param {number} [limit=100]
   * @returns {Promise<ReportModel[]>}
   */
  async getAll(userId = null, limit = 100) {
    const orderByDesc = `ORDER BY priority DESC`;
    if (userId === null) {
      return await ReportModel.all(limit, orderByDesc);
    }

    return await ReportModel.findAllBy("user_id", userId, orderByDesc);
  }

  /**
   * @param {number} user_id
   */
  async getAllByUserId(user_id) {
    return await ReportModel.findAllBy("user_id", user_id);
  }

  async updateStatus(id, body) {
    const validatedBody = this.UpdateStatusValidation.parse(body);

    /** @type {ReportModel|null}*/
    const report = await ReportModel.findById(id);
    if (!report) {
      throw new HttpError({ code: 404 });
    }

    report.status = validatedBody.status;
    return await report.save();
  }

  async delete(id) {
    await ReportModel.deleteWhere("id", id);
  }
}

const reportsService = new ReportsService();

module.exports = reportsService;
