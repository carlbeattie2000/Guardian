const HttpError = require("../utils/httpError");

/**
 * @param {Error} err
 * @param {import('express').Request} Request
 * @param {import('express').Response} Response
 * @param {import('express').NextFunction} NextFunction
 */
function HttpErrorMiddleware(err, req, res, next) {
  if (err instanceof HttpError) {
    err.handleLogging();

    return err.handleResponse(res);
  }

  console.error(err);
  res.sendStatus(500);
}

module.exports = HttpErrorMiddleware;
