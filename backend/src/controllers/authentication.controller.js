const cookieOptions = require("../config/cookieOptions");
const authenticationService = require("../services/users/authentication.service");
const HttpResponse = require("../utils/HttpResponseHelper");

class AuthenticationController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
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
      .cookie("refreshToken", refresh, cookieOptions);

    new HttpResponse(200, {
      accessToken: access,
      refreshToken: refresh,
    }).json(res);
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async register(req, res) {
    const registerRes = await authenticationService.register(req.body);

    new HttpResponse(registerRes.code, {}, registerRes.message).json(res);
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async isAuthed(req, res) {
    if (req.user) {
      return new HttpResponse(204).sendStatus(res);
    }

    return new HttpResponse(401).sendStatus(res);
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async profile(req, res) {
    const userProfileDetails = await authenticationService.getProfile(req.user);

    new HttpResponse(200, userProfileDetails).json(res);
  }
}

const authenticationController = new AuthenticationController();

module.exports = authenticationController;
