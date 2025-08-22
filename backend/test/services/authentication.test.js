const assert = require("node:assert");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const authenticationService = require("../../src/services/authentication.service");

describe("AuthenticationService", function () {
  describe("verifyToken", function () {
    it("given a valid token, it should return it's payload", async function () {
      const tokenExp = Math.floor(Date.now() / 1000) + 60 * 60;
      const jti = uuidv4();
      const sub = 1;
      const token = jwt.sign({ sub, jti, exp: tokenExp }, "jsonwebtokensecret");

      process.env.JWT_ACCESS_SECRET = "jsonwebtokensecret";

      const tokenPayload = await authenticationService.verifyToken(token);
      assert.equal(tokenPayload.sub, sub);
      assert.equal(tokenPayload.jti, jti);
    });
  });
});
