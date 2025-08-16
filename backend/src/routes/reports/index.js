const { Router } = require("express");
const reportRouter = require("./report.route");
const AuthorisationMiddleware = require("../../middleware/authorization");

const reportsRouter = Router();

reportsRouter.use("/reports", AuthorisationMiddleware, reportRouter);

module.exports = reportsRouter;
