const authenticationService = require("../services/users/authentication.service");

class AuthenticationController {
  async register(req, res) {
    const registerRes = await authenticationService.register(req.body);

    return res.status(registerRes.code).json(registerRes);
  }
}

const authenticationController = new AuthenticationController();

module.exports = authenticationController;
