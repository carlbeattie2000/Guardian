const { Router } = require("express");

const authenticationViewsRouter = Router();

authenticationViewsRouter.get("/login", (req, res) => {
  res.render("login.pug");
});

authenticationViewsRouter.get("/register", (req, res) => {
  res.render("register.pug");
});

module.exports = authenticationViewsRouter;
