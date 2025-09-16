import User from "#models/user";
import { HttpContext } from "@adonisjs/core/http";
import app from "@adonisjs/core/services/app";

const FiveDaysInMs = 1000 * 60 * 60 * 24 * 5;

export class AuthenticationService {
	async refreshToken({ response, auth }: HttpContext) {
		const token = auth.user?.currentAccessToken;

		if (!token) {
			return response.status(401);
		}

		if (token.expiresAt!.getTime() - Date.now() > FiveDaysInMs) {
			return response.status(400);
		}

		const accessToken = await User.accessToken.create(auth.user);
		const rawAccessToken = accessToken.value!.release();

		await auth.use("api").invalidateToken();

		response.cookie("access_token", rawAccessToken, {
			secure: app.inProduction ? true : false,
			httpOnly: true,
			sameSite: "lax",
		});

		return {
			access_token: rawAccessToken,
		};
	}
}
