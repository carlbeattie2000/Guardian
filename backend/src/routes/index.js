const { Router } = require("express");
const AuthorisationMiddleware = require("../middleware/authorization.middleware");

const authenticationRouter = require("./authentication");
const reportsRouter = require("./reports");
const lostArticlesRouter = require("./lostArticles");

const authenticationViewsRouter = require("./views/authentication.view.route");
const dashboardViewRouter = require("./views/dashboard.view.route");
const reportsViewRouter = require("./views/reports.view.route");

const router = Router();

router.use("/api/v1/auth", authenticationRouter);
router.use("/api/v1", AuthorisationMiddleware, reportsRouter);
router.use("/api/v1", AuthorisationMiddleware, lostArticlesRouter);

router.use("/", authenticationViewsRouter);
router.use("/", AuthorisationMiddleware, dashboardViewRouter);
router.use("/", AuthorisationMiddleware, reportsViewRouter);

module.exports = router;
