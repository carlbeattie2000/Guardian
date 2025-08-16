const { Router } = require("express");
const AuthorisationMiddleware = require("../../middleware/authorization.middleware");
const authenticationService = require("../../services/users/authentication.service");

const dashboardViewRouter = Router();

dashboardViewRouter.get("/", AuthorisationMiddleware, async (req, res) => {
  const user = await authenticationService.getUserById(req.user);
  console.log(process.env.MAP_BOX_TOKEN);
  res.render("dashboard.pug", {
    username: user.username,
    mapboxToken: process.env.MAP_BOX_TOKEN,
  });
});

module.exports = dashboardViewRouter;
