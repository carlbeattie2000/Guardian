require("dotenv").config();
const express = require("express");
const router = require("./routes");
const cookieParser = require("cookie-parser");

const registerSwaggerForDevEnv = require("./config/swagger");
const usePublicDir = require("./config/staticFiles");
const HttpErrorMiddleware = require("./middleware/errors.middleware");
const useTemplateEngine = require("./config/templateEngine");

const app = express();

registerSwaggerForDevEnv(app);

app.use(cookieParser());
app.use(express.static(usePublicDir()));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

// Only enabled when dev env set to DEVELOPMENT
useTemplateEngine(app);

app.use(HttpErrorMiddleware);

app.listen(2699);
