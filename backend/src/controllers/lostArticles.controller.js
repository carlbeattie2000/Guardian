const lostArticleService = require("../services/lostArticles/lostArticles.service");
const personalDetailsService = require("../services/personalDetails/personalDetails.service");
const HttpResponse = require("../utils/HttpResponseHelper");

class LostArticlesController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async create(req, res) {
    const createLostArticleRes = await lostArticleService.create(
      req.files,
      req.body,
      req.user,
    );

    new HttpResponse(createLostArticleRes.code, createLostArticleRes.data).json(
      res,
    );
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getById(req, res) {
    const id = req.params.id;
    const getLostArticleRes = await lostArticleService.getById(id, req.user);

    new HttpResponse(getLostArticleRes.code, getLostArticleRes.data).json(res);
  }

  /**
   * @param {import('express').Response} res
   */
  async getAll(_, res) {
    const getAllLostArticlesRes = await lostArticleService.getAll();

    new HttpResponse(
      getAllLostArticlesRes.code,
      getAllLostArticlesRes.data,
    ).json(res);
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

    new HttpResponse(
      createLostArticlePersonalDetailsRes.code,
      createLostArticlePersonalDetailsRes.data,
    ).json(res);
  }
}

const lostArticlesControler = new LostArticlesController();

module.exports = lostArticlesControler;
