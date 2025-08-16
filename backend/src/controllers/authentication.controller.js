const cookieOptions = require("../config/cookieOptions");
const authenticationService = require("../services/users/authentication.service");

class AuthenticationController {
  /**
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  async login(req, res) {
    const loginRes = await authenticationService.login(req.body);

    if (loginRes.error) {
      return res.status(loginRes.code).json(loginRes);
    }

    const [access, refresh] = authenticationService.generateTokens(
      loginRes.data.id,
    );

    res
      .cookie("accessToken", access, cookieOptions)
      .cookie("refreshToken", refresh, cookieOptions)
      .sendStatus(201);
  }

  /**
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  async register(req, res) {
    const registerRes = await authenticationService.register(req.body);

    res.status(registerRes.code).json(registerRes);
  }
}

const authenticationController = new AuthenticationController();

module.exports = authenticationController;
