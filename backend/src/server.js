require("dotenv").config();
const express = require("express");
const router = require("./routes");
const cookieParser = require("cookie-parser");

const registerSwaggerForDevEnv = require("./config/swagger");
const usePublicDir = require("./config/static-files");
const HttpErrorMiddleware = require("./middleware/errors.middleware");
const useTemplateEngine = require("./config/template-engine");
const securityHeadersMiddleware = require("./middleware/security-headers.middleware");
const notFoundMiddleware = require("./middleware/not-found.middleware");
const rateLimitMiddleware = require("./middleware/rate-limiting.middleware");

const app = express();

registerSwaggerForDevEnv(app);

app.use(cookieParser());
app.use(express.static(usePublicDir()));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(securityHeadersMiddleware);
app.disable("x-powered-by");
app.use(router);
app.use(rateLimitMiddleware());

// Only enabled when dev env set to DEVELOPMENT
useTemplateEngine(app);

app.use(notFoundMiddleware);
app.use(HttpErrorMiddleware);

app.listen(2699);
