const cookieOptions = require("../config/cookie-options");
const {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} = require("../constants/cookies");
const authenticationService = require("../services/authentication.service");
const HttpResponse = require("../utils/http-response-helper");
const getJwtFromRequest = require("../utils/jwts");

class AuthenticationController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async login(req, res) {
    const user = await authenticationService.login(req.body);

    if (!user) {
      return new HttpResponse(400, {}, "").json(res);
    }

    const [access, refresh] = await authenticationService.generateTokens(
      user.id,
    );

    res
      .cookie(ACCESS_TOKEN_COOKIE_NAME, access, cookieOptions)
      .cookie(REFRESH_TOKEN_COOKIE_NAME, refresh, cookieOptions);

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
    await authenticationService.register(req.body);

    new HttpResponse(200, {}, "").json(res);
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async logout(req, res) {
    const { access } = getJwtFromRequest(req, "access");
    await authenticationService.logout(req.user, access);
    res
      .clearCookie(ACCESS_TOKEN_COOKIE_NAME)
      .clearCookie(REFRESH_TOKEN_COOKIE_NAME);
    new HttpResponse(204).sendStatus(res);
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async logoutAllSessions(req, res) {
    await authenticationService.logout(req.user);
    res
      .clearCookie(ACCESS_TOKEN_COOKIE_NAME)
      .clearCookie(REFRESH_TOKEN_COOKIE_NAME);
    new HttpResponse(204).sendStatus(res);
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
    const user = await authenticationService.getProfile(req.user);

    if (!user) {
      return new HttpResponse(400).json(res);
    }

    new HttpResponse(200, userProfileDetails).json(res);
  }
}

const authenticationController = new AuthenticationController();

module.exports = authenticationController;
