class HttpResponse {
  data;
  message;
  code;

  constructor(code, data = {}, message = "") {
    this.code = code || 200;
    this.data = data;
    this.message = message;

    return this;
  }

  json(res) {
    res.status(this.code).json({
      status: this.code >= 200 && this.code < 300 ? "success" : "error",
      data: this.data,
      message: this.message,
    });
  }

  sendStatus(res) {
    res.sendStatus(this.code);
  }
}

module.exports = HttpResponse;
