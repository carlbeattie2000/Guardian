const z = require("zod");
const ReportModel = require("../../models/report.model");
const FileStorage = require("../../lib/fileStorage");
const ReportImagesModel = require("../../models/report-images.model");
const errorService = require("../error-service");
const UserModel = require("../../models/user.model");
const personalDetailsService = require("../personalDetails/personalDetails.service");

class ReportsService {
  ReportValidation = z.object({
    description: z.string(),
    longitude: z.preprocess((val) => Number(val), z.number()).optional(),
    latitude: z.preprocess((val) => Number(val), z.number()).optional(),
  });

  async create(files, body, user_id) {
    const reportDetailsValidated = this.ReportValidation.parse(body);
    const report = new ReportModel(
      reportDetailsValidated.description,
      reportDetailsValidated.longitude,
      reportDetailsValidated.latitude,
      user_id,
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

    return {
      error: false,
      code: 201,
      data: {
        id: report.id,
      },
    };
  }

  /**
   * @param {number} id
   */
  async getById(id) {
    const report = await ReportModel.findById(id);

    if (report !== null) {
      const personalDetails = await personalDetailsService.findByReportId(id);

      report.personal_details = personalDetails.data;
    }

    const imagePaths = await ReportImagesModel.findAllBy(
      "report_id",
      report.id,
    );

    report.images = imagePaths;

    return {
      error: false,
      code: 200,
      data: report,
    };
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
   */
  async getAll(limit = 100) {
    const reports = await ReportModel.all(limit);

    return {
      error: false,
      code: 200,
      data: reports,
    };
  }

  /**
   * @param {number} user_id
   */
  async getAllByUserId(user_id) {
    const reports = await ReportModel.findAllBy("user_id", user_id);

    return {
      error: false,
      code: 200,
      data: reports,
    };
  }
}

const reportsService = new ReportsService();

module.exports = reportsService;
