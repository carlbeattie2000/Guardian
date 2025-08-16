const { Router } = require("express");
const reportRouter = require("./report.route");
const AuthorisationMiddleware = require("../../middleware/authorization.middleware");

const reportsRouter = Router();

reportsRouter.use("/reports", AuthorisationMiddleware, reportRouter);

module.exports = reportsRouter;
