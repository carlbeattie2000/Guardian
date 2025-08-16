const { Router } = require("express");
const authenticationRouter = require("./authentication");
const reportsRouter = require("./reports");
const lostArticlesRouter = require("./lostArticles");
const AuthorisationMiddleware = require("../middleware/authorization.middleware");
const authenticationViewsRouter = require("./views/authentication.view.route");
const dashboardViewRouter = require("./views/dashboard.view.route");

const router = Router();

router.use("/api/v1", authenticationRouter);
router.use("/api/v1", AuthorisationMiddleware, reportsRouter);
router.use("/api/v1", AuthorisationMiddleware, lostArticlesRouter);

router.use("/", authenticationViewsRouter);
router.use("/", dashboardViewRouter);

module.exports = router;
