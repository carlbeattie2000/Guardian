import type { HttpContext } from "@adonisjs/core/http";
import type { NextFn } from "@adonisjs/core/types/http";

export default class LoadTokenIntoHeader {
	async handle(ctx: HttpContext, next: NextFn) {
		const tokenCookie = ctx.request.cookie("access_token");
		const tokenHeader = ctx.request.header("authorization");

		if (!tokenHeader && tokenCookie) {
			ctx.request.request.headers.authorization = `Bearer ${tokenCookie}`;
		}

		return next();
	}
}
