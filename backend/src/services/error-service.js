const z = require("zod");
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3");
const HttpError = require("../utils/http-error");

class ErrorService {
  /**
   * @param {Error} err
   */
  handleError(err) {
    if (err instanceof HttpError) {
      return err;
    }
    if (err instanceof z.ZodError) {
      return this.handleZodError(err);
    }

    if (err instanceof jwt.TokenExpiredError) {
      return this.handleJwtExpiredError();
    }

    if (err instanceof jwt.JsonWebTokenError) {
      return this.handleJwtError();
    }

    err = this.handleSqliteErrors(err);

    return this.handleHttpError(err);
  }

  /**
   * @param {Error} err
   * @param {number} [code=500]
   * @param {string} [message="Internal Server Error"]
   * @param {{}} [body={}]
   */
  handleHttpError(
    err,
    code = 500,
    message = "Internal Server Error",
    body = {},
  ) {
    if (err instanceof HttpError) {
      return err;
    }

    return new HttpError({ code, clientMessage: message, data: body }, err);
  }

  /**
   * @param {Error} err
   */
  handleZodError(err) {
    return new HttpError({ code: 400, data: err.issues }, err);
  }

  /**
   * @param {jwt.JsonWebTokenError} err
   */
  handleJwtError(err) {
    return new HttpError({ code: 401 }, err);
  }

  handleJwtExpiredError() {
    return new HttpError({ code: 401, clientMessage: "Access Token Expired" });
  }

  /**
   * @param {Error} err
   */
  handleSqliteErrors(err) {
    if (err.errno && err.errno === sqlite3.CONSTRAINT) {
      return new HttpError({ code: 400, clientMessage: "Bad Request" }, err);
    }

    return err;
  }
}

const errorService = new ErrorService();

module.exports = errorService;
