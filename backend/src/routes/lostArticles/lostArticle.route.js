const { Router } = require("express");
const multer = require("multer");
const lostArticlesControler = require("../../controllers/lostArticles.controller");
const OfficerAuthenticationMiddleware = require("../../middleware/officerAuthorization.middleware");

const lostArticleRouter = Router();
const upload = multer();

lostArticleRouter.post(
  "/",
  upload.array("photos", 12),
  lostArticlesControler.createLostArticle,
);

lostArticleRouter.post(
  "/add-personal-details/:id",
  lostArticlesControler.createPersonalDetails,
);
lostArticleRouter.get(
  "/all",
  OfficerAuthenticationMiddleware,
  lostArticlesControler.getAll,
);
lostArticleRouter.get("/:id", lostArticlesControler.getById);

module.exports = lostArticleRouter;
