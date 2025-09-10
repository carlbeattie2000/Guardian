const { Router } = require("express");
const OfficerAuthenticationMiddleware = require("../middleware/officer-authorization.middleware");
const lostArticlesControler = require("../controllers/lost-articles.controller");
const { imageUpload } = require("src/config/multer.config");

const upload = imageUpload();
const lostArticlesRouter = Router();

lostArticlesRouter.post(
  "/",
  upload.array("photos", 12),
  lostArticlesControler.create,
);

lostArticlesRouter.post(
  "/personal-details/:id",
  lostArticlesControler.createPersonalDetails,
);

lostArticlesRouter.get(
  "/all",
  OfficerAuthenticationMiddleware,
  lostArticlesControler.getAll,
);

lostArticlesRouter.get("/:id", lostArticlesControler.getById);

module.exports = lostArticlesRouter;
