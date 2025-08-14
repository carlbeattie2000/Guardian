const authenticationService = require("../services/users/authentication.service");

class AuthenticationController {
  async login(req, res) {
    const loginRes = await authenticationService.login(req.body);

    res.json(loginRes);
  }

  async register(req, res) {
    const registerRes = await authenticationService.register(req.body);

    return res.status(registerRes.code).json(registerRes);
  }
}

const authenticationController = new AuthenticationController();

module.exports = authenticationController;
