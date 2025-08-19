const { Router } = require("express");
const multer = require("multer");
const OfficerAuthenticationMiddleware = require("../../middleware/officerAuthorization.middleware");

const lostArticlesControler = require("../../controllers/lostArticles.controller");
const upload = multer();

const lostArticlesRouter = Router();

lostArticlesRouter.post(
  "/",
  upload.array("photos", 12),
  lostArticlesControler.create,
);

lostArticlesRouter.post(
  "/add-personal-details/:id",
  lostArticlesControler.createPersonalDetails,
);

lostArticlesRouter.get(
  "/all",
  OfficerAuthenticationMiddleware,
  lostArticlesControler.getAll,
);

lostArticlesRouter.get("/:id", lostArticlesControler.getById);

module.exports = lostArticlesRouter;
