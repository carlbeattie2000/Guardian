import app from "@adonisjs/core/services/app";
import type { HttpContext } from "@adonisjs/core/http";

import User from "#models/user";
import { AuthenticationService } from "#services/authentication_service";
import db from "@adonisjs/lucid/services/db";

export default class AuthenticationController {
	#authenticationService = new AuthenticationService();

	async store({ request, response, auth }: HttpContext) {
		const { username, password } = request.only(["username", "password"]);
		const user = await User.verifyCredentials(username, password);

		const accessToken = await auth.use("api").createToken(user);
		const refreshToken = await User.refreshToken.create(user);

		response.cookie("access_token", accessToken.value!.release(), {
			secure: app.inProduction ? true : false,
			httpOnly: true,
			sameSite: "lax",
		});
		response.cookie("refresh_token", refreshToken.value!.release(), {
			secure: app.inProduction ? true : false,
			httpOnly: true,
			sameSite: "lax",
		});

		return {
			access_token: accessToken.value!.release(),
			refresh_token: refreshToken.value!.release(),
		};
	}

	async create({ request, response }: HttpContext) {
		const { username, password, firstName, lastName, email } = request.only([
			"username",
			"password",
			"firstName",
			"lastName",
			"email",
		]);

		await User.create({ username, password, firstName, lastName, email });

		response.status(204);
	}

	async refresh(ctx: HttpContext) {
		return this.#authenticationService.refreshTokens(ctx);
	}

	async destroy({ auth, response }: HttpContext) {
		let bothFailed = true;
		let err: Error | null = null;

		const setError = (newErr: Error) => {
			if (err !== null) {
				err = newErr;
			}
		};

		try {
			await auth.use("api").invalidateToken(true);
			bothFailed = false;
		} catch (error) {
			setError(error);
		}

		try {
			await auth.use("cookie").invalidateToken(true);
			response.clearCookie("access_token");
			response.clearCookie("refresh_token");
			bothFailed = false;
		} catch (error) {
			setError(error);
		}

		if (bothFailed && err) {
			throw err;
		}
	}

	async destroyAll({ auth }: HttpContext) {
		const user = auth.user as User;

		await db.from("auth_access_tokens").where("tokenable_id", user.id).delete();
		await db
			.from("refresh_access_tokens")
			.where("tokenable_id", user.id)
			.delete();

		return {
			...(await User.accessToken.all(user)),
			...(await User.refreshToken.all(user)),
		};
	}
}
