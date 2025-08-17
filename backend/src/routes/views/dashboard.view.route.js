const { Router } = require("express");
const AuthorisationMiddleware = require("../../middleware/authorization.middleware");
const authenticationService = require("../../services/users/authentication.service");
const reportsService = require("../../services/reports/reports.service");

const dashboardViewRouter = Router();

dashboardViewRouter.get("/", async (req, res) => {
  const user = await authenticationService.getUserById(req.user);
  const userReports = await reportsService.getAllByUserId(req.user);

  res.render("dashboard.pug", {
    username: user.username,
    mapboxToken: process.env.MAP_BOX_TOKEN,
    reports: userReports.data,
  });
});

module.exports = dashboardViewRouter;
