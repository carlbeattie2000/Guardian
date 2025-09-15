import { defineConfig } from "@adonisjs/auth";
import { tokensUserProvider } from "@adonisjs/auth/access_tokens";
import type {
	InferAuthenticators,
	InferAuthEvents,
	Authenticators,
} from "@adonisjs/auth/types";
import { cookieTokensGuard } from "../app/auth/guards/tokenCookie.js";
import { customTokensGuard } from "../app/auth/guards/api.js";

const authConfig = defineConfig({
	default: "api",
	guards: {
		api: customTokensGuard({
			provider: tokensUserProvider({
				tokens: "accessToken",
				model: () => import("#models/user"),
			}),
			refreshProvider: tokensUserProvider({
				tokens: "refreshToken",
				model: () => import("#models/user"),
			}),
		}),
		cookie: cookieTokensGuard({
			provider: tokensUserProvider({
				tokens: "accessToken",
				model: () => import("#models/user"),
			}),
			refreshProvider: tokensUserProvider({
				tokens: "refreshToken",
				model: () => import("#models/user"),
			}),
		}),
	},
});

export default authConfig;

/**
 * Inferring types from the configured auth
 * guards.
 */
declare module "@adonisjs/auth/types" {
	export interface Authenticators
		extends InferAuthenticators<typeof authConfig> {}
}
declare module "@adonisjs/core/types" {
	interface EventsList extends InferAuthEvents<Authenticators> {}
}
