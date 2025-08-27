class ExpressMockRequest {
  static new() {
    return {
      headers: {},
      body: undefined,
      cookies: {},
      method: "",
      params: {},
      query: {},
      res: null,
    };
  }
}

module.exports = ExpressMockRequest;
