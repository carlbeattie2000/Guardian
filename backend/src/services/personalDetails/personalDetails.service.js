const z = require("zod");
const errorService = require("../error-service");
const PersonalDetailsModel = require("../../models/personalDetails.model");

class PersonalDetailsService {
  PersonalDetailsValidation = z.object({
    first_name: z.string(),
    last_name: z.string(),
    date_of_birth: z.iso.date(),
    contact_number: z.string(),
  });

  async createPersonalDetails(body) {
    try {
      const { first_name, last_name, date_of_birth, contact_number } =
        this.PersonalDetailsValidation.parse(body);

      const personalDetails = new PersonalDetailsModel(
        first_name,
        last_name,
        date_of_birth,
        contact_number,
      );

      await personalDetails.save();

      return personalDetails;
    } catch (err) {
      errorService.handleError(err);
    }
  }

  async createReportWitness(body, report_id) {
    const personalDetails = await this.createPersonalDetails(body);
    personalDetails.attachToReport(report_id);
    await personalDetails.save();

    return {
      error: false,
      code: 200,
      data: personalDetails,
    };
  }

  async createLostArticlePersonalDetails(body, lost_article_id) {
    const personalDetails = await this.createPersonalDetails(body);
    personalDetails.attachToLostArticle(lost_article_id);
    await personalDetails.save();

    return {
      error: false,
      code: 200,
      data: personalDetails,
    };
  }

  async findByReportId(report_id) {
    try {
      const result = await PersonalDetailsModel.findAllBy(
        "report_id",
        report_id,
      );

      return {
        error: false,
        code: 200,
        data: result,
      };
    } catch (err) {
      errorService.handleError(err);
    }
  }

  async findByLostArticleId(lost_article_id) {
    try {
      const result = await PersonalDetailsModel.findAllBy(
        "lost_article_id",
        lost_article_id,
      );

      return {
        error: false,
        code: 200,
        data: result,
      };
    } catch (err) {
      errorService.handleError(err);
    }
  }
}

const personalDetailsService = new PersonalDetailsService();

module.exports = personalDetailsService;
