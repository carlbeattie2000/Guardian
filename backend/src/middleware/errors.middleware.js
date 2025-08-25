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
  const httpError = errorService.handleError(err, req.id, req.path);
  httpError.handleLogging();
  return httpError.handleResponse(res);
}

module.exports = HttpErrorMiddleware;
