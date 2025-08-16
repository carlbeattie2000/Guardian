const z = require("zod");
const ReportModel = require("../../models/report.model");
const FileStorage = require("../../lib/fileStorage");
const ReportImagesModel = require("../../models/report-images.model");
const errorService = require("../error-service");
const UserModel = require("../../models/user.model");

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
      return errorService.handleError(err);
    }
  }

  async getReportById(id) {
    try {
      const report = await ReportModel.findById(id);

      return {
        error: false,
        code: 200,
        data: report,
      };
    } catch (err) {
      return errorService.handleError(err);
    }
  }

  async canUserViewReport(report, user_id) {
    const user = await UserModel.findById(user_id);

    if (user === null) {
      return false;
    }

    return user.is_officer || report.user_id === user_id;
  }
}

const reportsService = new ReportsService();

module.exports = reportsService;
