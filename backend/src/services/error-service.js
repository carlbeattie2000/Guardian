const z = require("zod");
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3");
const HttpError = require("../utils/httpError");

class ErrorService {
  handleError(err) {
    if (err instanceof z.ZodError) {
      this.handleZodError(err);
    }

    if (err instanceof jwt.TokenExpiredError) {
      this.handleJwtExpiredError();
    }

    if (err instanceof jwt.JsonWebTokenError) {
      this.handleJwtError();
    }

    this.handleSqliteErrors(err);

    this.handleHttpError(err);
  }

  handleHttpError(
    err,
    code = 500,
    message = "Internal Server Error",
    body = {},
  ) {
    throw new HttpError({ code, clientMessage: message, data: body }, err);
  }

  handleZodError(err) {
    throw new HttpError({ code: 400, data: err.issues }, err);
  }

  /**
   * @param {jwt.JsonWebTokenError} err
   */
  handleJwtError(err) {
    throw new HttpError({ code: 401 }, err);
  }

  handleJwtExpiredError() {
    throw new HttpError({ code: 401, clientMessage: "Access Token Expired" });
  }

  handleSqliteErrors(err) {
    if (err.errno && err.errno === sqlite3.CONSTRAINT) {
      throw new HttpError({ code: 400, clientMessage: "Bad Request" }, err);
    }
  }
}

const errorService = new ErrorService();

module.exports = errorService;
