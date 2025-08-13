const z = require('zod');
const jwt = require('jsonwebtoken');

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

    this.handleHttpError();
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
}

const errorService = new ErrorService();

module.exports = errorService
