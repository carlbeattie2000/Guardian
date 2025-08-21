const errorService = require("../services/error-service");
const defaultLogger = require("../config/logging");
const HttpError = require("../utils/http-error");

/**
 * @param {Error} err
 * @param {import('express').Request} Request
 * @param {import('express').Response} Response
 * @param {import('express').NextFunction} NextFunction
 */
function HttpErrorMiddleware(err, req, res, next) {
  err = errorService.handleError(err);

  if (err instanceof HttpError) {
    err.handleLogging();

    return err.handleResponse(res);
  }

  res.sendStatus(500);
}

module.exports = HttpErrorMiddleware;
