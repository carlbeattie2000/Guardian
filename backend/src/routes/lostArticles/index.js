const { Router } = require("express");
const lostArticleRouter = require("./lostArticle.route");

const lostArticlesRouter = Router();

lostArticlesRouter.use("/lost-articles", lostArticleRouter);

module.exports = lostArticlesRouter;
