/**
 * @param {import('express').Application} app
 */
function useTemplateEngine(app) {
  if (process.env.DEV_ENVIROMENT !== "DEVELOPMENT") {
    return;
  }

  app.set("view engine", "pug");
}

module.exports = useTemplateEngine;
