const { Router } = require("express");

const lostArticleViewRouter = Router();

lostArticleViewRouter.get("/login", (req, res) => {
  res.render("login.pug");
});

module.exports = lostArticleViewRouter;
