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

		response.cookie("access_token", accessToken.value!.release(), {
			secure: app.inProduction ? true : false,
			httpOnly: true,
			sameSite: "lax",
		});

		return {
			access_token: accessToken.value!.release(),
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
		return this.#authenticationService.refreshToken(ctx);
	}

	async destroy({ auth, response }: HttpContext) {
		await auth.use("api").invalidateToken();

		response.status(204);
	}

	async destroyAll({ auth, response }: HttpContext) {
		const user = auth.user as User;

		await db.from("auth_access_tokens").where("tokenable_id", user.id).delete();
		response.status(204);
	}
}
