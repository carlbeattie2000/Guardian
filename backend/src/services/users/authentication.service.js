const z = require("zod");
const jwt = require("jsonwebtoken");
const errorService = require("../error-service");
const UserModel = require("../../models/user.model");
const HttpError = require("../../utils/httpError");

const UserLogin = z.object({
  username: z.string(),
  password: z.string(),
});

const UserRegister = z.object({
  username: z.string().min(5),
  password: z.string().min(8),
  email: z.string().optional(),
});

class AuthenticationService {
  async login(loginDetails) {
    const validatedLoginDetails = UserLogin.parse(loginDetails);
    const foundUserDetails = await UserModel.findBy(
      "username",
      validatedLoginDetails.username,
    );

    if (!foundUserDetails) {
      throw new HttpError({
        code: 400,
        clientMessage: "Bad Login Request",
      });
    }
    if (
      !(await foundUserDetails.verifyPassword(validatedLoginDetails.password))
    ) {
      throw new HttpError({
        code: 400,
        clientMessage: "Bad Login Request",
      });
    }

    return {
      error: false,
      data: foundUserDetails,
    };
  }

  async register(registerDetails) {
    const validatdRegisterDetails = UserRegister.parse(registerDetails);
    const user = new UserModel(
      validatdRegisterDetails.username,
      validatdRegisterDetails.email,
      validatdRegisterDetails.password,
      false,
    );

    await user.save();

    return {
      error: false,
      code: 200,
      message: "Register Success",
    };
  }

  /**
   * @param {number} id
   */
  async getUserById(id) {
    const user = await UserModel.findById(id);
    return user;
  }

  /**
   * @param {number} userId
   */
  generateTokens(userId) {
    const access = jwt.sign(
      { sub: userId, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
      process.env.JWT_ACCESS_SECRET,
    );
    const refresh = jwt.sign(
      { sub: userId, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
      process.env.JWT_REFRESH_SECRET,
    );

    return [access, refresh];
  }

  /**
   * @param {string} token
   * @param {string} [type="access"]
   */
  verifyToken(token, type = "access") {
    const payload = jwt.verify(
      token,
      type == "refresh"
        ? process.env.JWT_REFRESH_SECRET
        : process.env.JWT_ACCESS_SECRET,
    );

    return {
      error: false,
      payload,
    };
  }

  /**
   * @param {string} token
   */
  async refreshToken(token) {
    const tokenVerified = this.verifyToken(token, "refresh");
    if (!tokenVerified.error) {
      const userId = tokenVerified.payload.sub;
      return this.generateTokens(userId);
    }
    return tokenVerified;
  }

  /**
   * @param {string} token
   */
  async revokeToken(token) {}

  async logout() {}

  /**
   * @param {number} id
   */
  async getProfile(id) {
    const userDetails = await UserModel.findById(id);
    return us;
  }
}

const authenticationService = new AuthenticationService();

module.exports = authenticationService;
