const { Router } = require("express");
const AuthorisationMiddleware = require("../middleware/authorization.middleware");

const reportsRouter = require("./reports.route");
const lostArticlesRouter = require("./lost-articles.route");
const authenticationRouter = require("./authentication.route");
const mapBoxRouter = require("./map-box.route");
const fileRouter = require("./files.route");

const router = Router();

router.use("/api/v1/auth", authenticationRouter);
router.use("/api/v1/reports", AuthorisationMiddleware, reportsRouter);
router.use(
  "/api/v1/lost-articles",
  AuthorisationMiddleware,
  lostArticlesRouter,
);
router.use("/api/v1/map-box", AuthorisationMiddleware, mapBoxRouter);
router.use("/api/v1/files", fileRouter);

module.exports = router;
