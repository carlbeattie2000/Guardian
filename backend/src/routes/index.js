const { Router } = require("express");
const AuthorisationMiddleware = require("../middleware/authorization.middleware");
const rateLimitMiddleware = require("../middleware/rate-limiting.middleware");

const reportsRouter = require("./reports.route");
const lostArticlesRouter = require("./lost-articles.route");
const authenticationRouter = require("./authentication.route");

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

module.exports = router;
