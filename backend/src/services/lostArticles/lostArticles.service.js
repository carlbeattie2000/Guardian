const z = require("zod");
const LostItemModel = require("../../models/lost-item.model");
const FileStorage = require("../../lib/fileStorage");
const ReportImagesModel = require("../../models/report-images.model");
const errorService = require("../error-service");
const personalDetailsService = require("../personalDetails/personalDetails.service");

class LostArticleService {
  articleValidation = z.object({
    name: z.string(),
    description: z.string(),
    serial_number: z.string().optional(),
    color: z.string().optional(),
    model: z.string().optional(),
  });

  async createLostArticle(files, body, user_id) {
    try {
      const { name, description, serial_number, color, model } =
        this.articleValidation.parse(body);
      const lostArticle = new LostItemModel(
        name,
        description,
        serial_number,
        color,
        model,
        user_id,
      );

      await lostArticle.save();

      if (Array.isArray(files) && files.length > 0) {
        for (const file of files) {
          const fileName = await FileStorage.saveImage(file);

          new ReportImagesModel(lostArticle.id, fileName).save();
        }
      }

      return {
        error: false,
        code: 201,
        data: {
          id: lostArticle.id,
        },
      };
    } catch (err) {
      errorService.handleError(err);
    }
  }

  async getById(id, user_id, is_officer = false) {
    try {
      const result = is_officer
        ? await LostItemModel.findById(id)
        : await LostItemModel.findBy(["id", "user_id"], [id, user_id]);

      if (result !== null) {
        const personalDetails =
          await personalDetailsService.findByLostArticleId(id);
        result.personal_details = personalDetails.data;
      }

      return {
        error: false,
        code: 200,
        data: result,
      };
    } catch (err) {
      errorService.handleError(err);
    }
  }

  async getAll(limit = 100) {
    try {
      const results = await LostItemModel.all(limit);

      return {
        error: false,
        code: 200,
        data: results,
      };
    } catch (err) {
      errorService.handleError(err);
    }
  }

  async canModify(id, user_id, is_officer = false) {
    if (is_officer) {
      return true;
    }

    const lostArticle = await LostItemModel.findById(id);

    if (lostArticle && lostArticle.user_id === user_id) {
      return true;
    }
  }
}

const lostArticleService = new LostArticleService();

module.exports = lostArticleService;
