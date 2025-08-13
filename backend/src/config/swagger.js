const yaml = require('yamljs');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDocument = yaml.load('docs/openapi.yaml');

function registerSwaggerForDevEnv(app) {
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
  }
}

module.exports = registerSwaggerForDevEnv
