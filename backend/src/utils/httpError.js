class HttpError extends Error {
  code;
  data;
  clientMessage;

  constructor({ code = 500, clientMessage = "", message = "", data = {} }) {
    super(message);

    this.code = code;
    this.data = data;
    this.clientMessage = clientMessage;
  }

  /**
   * @param {import("express").Response} res
   */
  handleResponse(res) {
    res
      .status(this.code)
      .json({ code: this.code, message: this.clientMessage, data: this.data });
  }

  handleLogging() {
    console.error(this.code, this.message, this.stack);
  }
}

module.exports = HttpError;
