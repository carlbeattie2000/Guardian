const lostArticleService = require("../services/lostArticles/lostArticles.service");
const personalDetailsService = require("../services/personalDetails/personalDetails.service");

class LostArticlesController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async createLostArticle(req, res) {
    const createLostArticleRes = await lostArticleService.createLostArticle(
      req.files,
      req.body,
      req.user,
    );

    res.status(createLostArticleRes.code).json(createLostArticleRes);
  }

  async getById(req, res) {
    const id = req.params.id;
    const getLostArticleRes = await lostArticleService.getById(id, req.user);

    res.status(getLostArticleRes.code).json(getLostArticleRes);
  }

  async getAll(_, res) {
    const getAllLostArticlesRes = await lostArticleService.getAll();

    res.status(getAllLostArticlesRes.code).json(getAllLostArticlesRes);
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async createPersonalDetails(req, res) {
    const id = req.params.id;
    const canModifyLostArticle = await lostArticleService.canModify(
      id,
      req.user,
    );

    if (!canModifyLostArticle) {
      throw new HttpError({ code: 401 });
    }

    const createLostArticlePersonalDetailsRes =
      await personalDetailsService.createLostArticlePersonalDetails(
        req.body,
        id,
      );

    return res
      .status(createLostArticlePersonalDetailsRes.code)
      .json(createLostArticlePersonalDetailsRes);
  }
}

const lostArticlesControler = new LostArticlesController();

module.exports = lostArticlesControler;
