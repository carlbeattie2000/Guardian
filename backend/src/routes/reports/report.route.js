const { Router } = require("express");
const reportsController = require("../../controllers/reports.controller");
const OfficerAuthenticationMiddleware = require("../../middleware/officerAuthorization.middleware");

const reportRouter = Router();

module.exports = reportRouter;
