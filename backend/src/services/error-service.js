const z = require('zod');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3');

class ErrorService {
  handleError(err) {
    if (err instanceof z.ZodError) {
      return this.handleZodError(err);
    }

    if (err instanceof jwt.TokenExpiredError) {
      return this.handleJwtExpiredError();
    }

    if (err instanceof jwt.JsonWebTokenError) {
    }

    const sqliteError = this.handleSqliteErrors(err);

    if (sqliteError) {
      return sqliteError;
    }

    return this.handleHttpError();
  }

  handleHttpError(code = 500, message = "Internal Server Error", body = {}) {
    return {
      error: true,
      code,
      message,
      body
    }
  }

  handleZodError(err) {
    return this.handleHttpError(400, err.message, err.issues)
  }

  handleJwtExpiredError() {
    return this.handleHttpError(401, 'Access Token Expired');
  }

  handleSqliteErrors(err) {
    if (err.errno && err.errno === sqlite3.CONSTRAINT) {
      return this.handleHttpError(400, "Bad Request");
    }

    return null;
  }
}

const errorService = new ErrorService();

module.exports = errorService
