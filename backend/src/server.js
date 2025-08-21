require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");

const router = require("./routes");

const registerSwaggerForDevEnv = require("./config/swagger");
const HttpErrorMiddleware = require("./middleware/errors.middleware");
const securityHeadersMiddleware = require("./middleware/security-headers.middleware");
const notFoundMiddleware = require("./middleware/not-found.middleware");
const rateLimitMiddleware = require("./middleware/rate-limiting.middleware");

const app = express();
const PORT = process.env.PORT || 2699;

registerSwaggerForDevEnv(app);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(securityHeadersMiddleware);
app.disable("x-powered-by");
app.use(router);
app.use(rateLimitMiddleware());

app.use(notFoundMiddleware);
app.use(HttpErrorMiddleware);

app.listen(PORT);
