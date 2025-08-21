const { Router } = require("express");
const AuthorisationMiddleware = require("../middleware/authorization.middleware");
const rateLimitMiddleware = require("../middleware/rate-limiting.middleware");

const reportsRouter = require("./reports.route");
const lostArticlesRouter = require("./lost-articles.route");
const authenticationRouter = require("./authentication.route");

const authenticationViewsRouter = require("./views/authentication.view.route");
const dashboardViewRouter = require("./views/dashboard.view.route");
const reportsViewRouter = require("./views/reports.view.route");

const router = Router();

router.use(
  "/api/v1/auth",
  rateLimitMiddleware({ ipLimit: 15, ipWindowMs: 1000 * 60 * 5 }),
  authenticationRouter,
);
router.use("/api/v1/reports", AuthorisationMiddleware, reportsRouter);
router.use(
  "/api/v1/lost-articles",
  AuthorisationMiddleware,
  lostArticlesRouter,
);

router.use("/", authenticationViewsRouter);
router.use("/", AuthorisationMiddleware, dashboardViewRouter);
router.use("/", AuthorisationMiddleware, reportsViewRouter);

module.exports = router;
