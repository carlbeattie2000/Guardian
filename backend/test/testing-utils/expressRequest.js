class ExpressMockRequest {
  static new() {
    const request = {
      finshed: false,
      destroyed: false,
      headers: {},
      body: undefined,
      cookies: {},
      method: "",
      params: {},
      query: {},
      res: null,
      maxHeadersCount: 2000,
      path: "",
      method: "",
      host: "",
      protocol: "",

      getHeader(name) {
        this.headers[name];
        return this;
      },
      setHeader(name, value) {
        this.headers[name] = value;
        return this;
      },
      getHeaderNames() {
        return Object.keys(this.headers);
      },
      getHeaders() {
        return Object.fromEntries(
          Object.entries(this.headers).map(([key, value]) => [
            key.toLowerCase(),
            value,
          ]),
        );
      },
      getRawHeaderNames() {
        return Object.keys(this.headers);
      },
      hasHeader(name) {
        return Object.prototype.hasOwnProperty.call(this.headers, name);
      },
      removeHeader(name) {
        if (this.hasHeader(name)) {
          delete this.headers[name];
        }
      },
      end(chunk, encoding, callback) {
        this.finshed = true;
      },
      destroy(error) {
        if (this.destroyed) {
          return this;
        }

        this.destroyed = true;

        return this;
      },
    };

    Object.defineProperty(request, "writableFinished", {
      get() {
        return this._finshed === true;
      },
      enumerable: true,
      configurable: true,
    });

    Object.defineProperty(request, "writableEnded", {
      get() {
        return this._finshed === true;
      },
      enumerable: true,
      configurable: true,
    });

    return request;
  }
}

module.exports = ExpressMockRequest;
