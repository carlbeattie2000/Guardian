import User from "#models/user";
import { Secret } from "@adonisjs/core/helpers";
import { HttpContext, Request } from "@adonisjs/core/http";
import app from "@adonisjs/core/services/app";

type Tokens = {
	accessToken: Secret<string> | null;
	refreshToken: Secret<string> | null;
};

export class AuthenticationService {
	#getTokensFromHeader(request: Request): Tokens {
		const tokens: Tokens = {
			accessToken: null,
			refreshToken: null,
		};

		const accessTokenHeader = request.header("authorization", "");
		const refreshTokenHeader = request.header("refresh_token", "");

		if (accessTokenHeader) {
			const [_, accessToken] = accessTokenHeader.split("bearer ");
			tokens.accessToken = new Secret<string>(accessToken);
		}

		if (refreshTokenHeader) {
			tokens.refreshToken = new Secret<string>(refreshTokenHeader);
		}

		return tokens;
	}

	#getTokensFromCookie(request: Request): Tokens {
		const accessToken = request.cookie("access_token");
		const refreshToken = request.cookie("refresh_token");
		return {
			accessToken: accessToken ? new Secret<string>(accessToken) : null,
			refreshToken: refreshToken ? new Secret<string>(refreshToken) : null,
		};
	}

	async refreshTokens({ request, response, auth }: HttpContext) {
		const { isApp } = request.only(["isApp"]);
		const type: "cookie" | "api" = isApp ? "api" : "cookie";
		const tokens: Tokens = isApp
			? this.#getTokensFromHeader(request)
			: this.#getTokensFromCookie(request);

		if (!tokens.refreshToken) {
			return response.status(401);
		}

		const accessTokenVerified = tokens.accessToken
			? await auth.use(type).userProvider.verifyToken(tokens.accessToken)
			: null;

		const refreshTokenVerified = await auth
			.use(type)
			.refreshProvider.verifyToken(tokens.refreshToken);
		if (!refreshTokenVerified) {
			return response.status(401);
		}

		if (
			accessTokenVerified &&
			accessTokenVerified.expiresAt!.getTime() - Date.now() > 1000 * 60 * 3
		) {
			return response.status(400);
		}
		if (accessTokenVerified) {
			await auth.use(type).authenticate();
		}

		const user = auth.use(type).isAuthenticated
			? auth.use(type).user
			: await User.find(refreshTokenVerified.tokenableId);

		if (!user) {
			return response.status(500);
		}

		const accessToken = await User.accessToken.create(user as User);
		const refreshToken = await User.refreshToken.create(user as User);
		const rawAccessToken = accessToken.value!.release();
		const rawRefreshToken = refreshToken.value!.release();

		await auth.use(type).refreshProvider.invalidateToken(tokens.refreshToken);
		await auth
			.use(type)
			.userProvider.invalidateToken(tokens.accessToken || new Secret(""));

		response.cookie("access_token", rawAccessToken, {
			secure: app.inProduction ? true : false,
			httpOnly: true,
			sameSite: "lax",
		});
		response.cookie("refresh_token", rawRefreshToken, {
			secure: app.inProduction ? true : false,
			httpOnly: true,
			sameSite: "lax",
		});

		return {
			access_token: rawAccessToken,
			refresh_token: rawRefreshToken,
		};
	}
}
