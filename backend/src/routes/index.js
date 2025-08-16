const { Router } = require("express");
const authenticationRouter = require("./authentication");
const reportsRouter = require("./reports");
const lostArticlesRouter = require("./lostArticles");
const AuthorisationMiddleware = require("../middleware/authorization.middleware");

const router = Router();

router.use("/api/v1", authenticationRouter);
router.use("/api/v1", AuthorisationMiddleware, reportsRouter);
router.use("/api/v1", AuthorisationMiddleware, lostArticlesRouter);

module.exports = router;
