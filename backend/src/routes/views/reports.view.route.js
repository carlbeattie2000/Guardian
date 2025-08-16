const { Router } = require("express");

const reportsViewRouter = Router();

reportsViewRouter.get("/login", (req, res) => {
  res.render("login.pug");
});

module.exports = reportsViewRouter;
