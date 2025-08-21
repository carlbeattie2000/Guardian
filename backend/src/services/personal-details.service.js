const z = require("zod");
const PersonalDetailsModel = require("../models/personal-details.model");

class PersonalDetailsService {
  PersonalDetailsValidation = z.object({
    first_name: z.string(),
    last_name: z.string(),
    date_of_birth: z.iso.date(),
    contact_number: z.string(),
  });

  async create(body) {
    const { first_name, last_name, date_of_birth, contact_number } =
      this.PersonalDetailsValidation.parse(body);

    const personalDetails = new PersonalDetailsModel(
      first_name,
      last_name,
      date_of_birth,
      contact_number,
    );

    return await personalDetails.save();
  }

  /**
   *  @param {*} body
   *  @param {number} report_id
   *  @returns {Promise<PersonalDetailsModel>}
   */
  async createReportWitness(body, report_id) {
    const personalDetails = await this.create(body);
    personalDetails.attachToReport(report_id);
    return await personalDetails.save();
  }

  /**
   * @returns {Promise<PersonalDetailsModel>}
   */
  async createLostArticlePersonalDetails(body, lost_article_id) {
    const personalDetails = await this.create(body);
    personalDetails.attachToLostArticle(lost_article_id);
    return await personalDetails.save();
  }

  /**
   * @param {number} report_id
   * @returns {Promise<PersonalDetailsModel | null>}
   */
  async findByReportId(report_id) {
    return await PersonalDetailsModel.findAllBy("report_id", report_id);
  }

  /**
   * @param {number} lost_article_id
   */
  async findByLostArticleId(lost_article_id) {
    const result = await PersonalDetailsModel.findAllBy(
      "lost_article_id",
      lost_article_id,
    );

    return {
      error: false,
      code: 200,
      data: result,
    };
  }
}

const personalDetailsService = new PersonalDetailsService();

module.exports = personalDetailsService;
