const { Router } = require("express");
const multer = require("multer");
const OfficerAuthenticationMiddleware = require("../middleware/officer-authorization.middleware");

const lostArticlesControler = require("../controllers/lost-articles.controller");
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
