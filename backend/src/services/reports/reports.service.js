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

  async createReport(files, body, user_id) {
    try {
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
    } catch (err) {
      errorService.handleError(err);
    }
  }

  async getReportById(id) {
    try {
      const report = await ReportModel.findById(id);

      if (report !== null) {
        const personalDetails = await personalDetailsService.findByReportId(id);

        report.personal_details = personalDetails.data;
      }

      return {
        error: false,
        code: 200,
        data: report,
      };
    } catch (err) {
      errorService.handleError(err);
    }
  }

  async canModifyReport(id, user_id, is_officer = false) {
    if (is_officer) {
      return true;
    }

    const report = await ReportModel.findById(id);

    if (report && report.user_id === user_id) {
      return true;
    }
  }

  async canUserViewReport(report, user_id) {
    const user = await UserModel.findById(user_id);

    if (user === null) {
      return false;
    }

    return user.is_officer || report.user_id === user_id;
  }

  async getAll(limit = 100) {
    try {
      const reports = await ReportModel.all(limit);

      return {
        error: false,
        code: 200,
        data: reports,
      };
    } catch (err) {
      errorService.handleError(err);
    }
  }
}

const reportsService = new ReportsService();

module.exports = reportsService;
